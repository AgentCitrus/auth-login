const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;
const SECRET_KEY = process.env.SECRET_KEY;

app.use(cors());
app.use(express.json());

const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const decodedToken = jwt.verify(token, SECRET_KEY);
        req.decodedToken = decodedToken;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Forbidden' });
    }
}

// Connect to MongoDB
mongoose.connect('mongodb://localhost/auth-login');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// sign up
app.post("/users", async (req, res) => {
    console.log(req.body);
    const { username, email, password } = req.body;
    try {
        if (await User.findOne({ email })) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username: username, email: email, password: hashedPassword });
        await newUser.save();
        const token = jwt.sign({ userId: newUser._id }, SECRET_KEY, { expiresIn: '10s' });
        res.status(201).json({ token: token });
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
});

// login
app.post("/session", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Email not found' });
        }
        const correctPassword = await bcrypt.compare(password, user.password);
        if (!correctPassword) {
            return res.status(400).json({ error: 'Incorrect password' });
        }
        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '10s' });
        res.json({ token: token });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
});

app.get("/auth/status", async (req, res) => {
    const token = req.headers.authorization;
    if (!token) return res.status(200).json({ isAuthorized: false });
    try {
        jwt.verify(token, SECRET_KEY);
        res.status(200).json({ isAuthenticated: true });
    } catch (error) {
        res.status(500).json({ isAuthenticated: false });
    }
});
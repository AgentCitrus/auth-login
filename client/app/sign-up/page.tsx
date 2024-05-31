"use client"

import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Image from "next/image";
import Navbar from "../navbar"
import AuthContext from "../context/authcontext";

import { useRouter } from 'next/navigation';

export default function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<any[]>([]);
    const [serverError, setServerError] = useState('');
    const authContext = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        setErrors([]);
        if (!username) { setErrors(errors => [...errors, 'Missing username']) }
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) { setErrors(errors => [...errors, 'Invalid email']) }
        if (!password) { setErrors(errors => [...errors, 'Missing password']) }
        if (password !== confirmPassword) { setErrors(errors => [...errors, 'Passwords do not match']) }
        if (serverError) { setErrors(errors => [...errors, serverError]) }
    }, [username, email, password, confirmPassword, serverError]);

    if (!authContext) {
        return null;
    }

    const { login } = authContext;

    const handleSubmit = async () => {
        if(!errors.length) {
            axios.post('http://localhost:5000/users', { username: username, email: email, password: password })
                .then(response => {
                    login(response.data.token);
                    console.log(response);
                    router.push('/');
                })
                .catch(error => {
                    if (error.response) {
                        setServerError(error.response.data.error);
                    } else {
                        console.error('An unknown error occurred');
                    }
                });
        }
    };

    return (
        <main className="flex justify-center items-center h-[calc(100vh_-_4rem)] relative">
            <form className="bg-black border-white border px-14 py-14 flex flex-col gap-5">
                <div>
                    <label className="pr-5" htmlFor="username">Username:</label>
                    <input className="rounded-lg text-black float-right" type="text" id="username" required={true} value={username} onChange={(e) => setUsername(e.target.value)}/>
                </div>
                
                <div>
                    <label className="pr-5" htmlFor="email">Email:</label>
                    <input className="rounded-lg text-black float-right" type="email" id="email" required={true} value={email} onChange={(e) => {
                        setEmail(e.target.value);
                        setServerError('');
                    }}/>
                </div>
                
                <div>
                    <label className="pr-5" htmlFor="password">Password:</label>
                    <input className="rounded-lg text-black float-right" type="password" id="password" required={true} value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>

                <div>
                    <label className="pr-5" htmlFor="confirmPassword">Confirm password:</label>
                    <input className="rounded-lg text-black float-right" type="password" id="confirmPassword" required={true} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                </div>

                <div>
                    {errors.map(error => (
                        <p key={error}>{error}</p>
                    ))}
                </div>

                <button type="button" className="bg-green-600 px-3 py-2 hover:bg-green-500 active:bg-green-700 transition mt-1 float-right rounded-lg" onClick={handleSubmit}>Submit</button>
            </form>
        </main>
    );
}

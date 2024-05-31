"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useContext } from 'react';
import AuthContext from "../context/authcontext";

import axios from 'axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<any[]>([]);
    const [serverError, setServerError] = useState('');
    const authContext = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        setErrors([]);
        if (!email) { setErrors(errors => [...errors, 'Missing email']) }
        if (!password) { setErrors(errors => [...errors, 'Missing password']) }
        if (serverError) { setErrors(errors => [...errors, serverError]) }
    }, [email, password, serverError]);

    if (!authContext) {
        return null;
    }

    const { login } = authContext;

    const handleSubmit = async () => {
        if(!errors.length) {
            axios.post('http://localhost:5000/session', { email: email, password: password })
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
                    <label className="pr-5" htmlFor="email">Email:</label>
                    <input className="rounded-lg text-black float-right" type="email" id="email" required={true} value={email} onChange={(e) => {
                        setEmail(e.target.value);
                        setServerError('');
                    }}/>
                </div>
                
                <div>
                    <label className="pr-5" htmlFor="password">Password:</label>
                    <input className="rounded-lg text-black float-right" type="password" id="password" required={true} value={password} onChange={(e) => {
                        setPassword(e.target.value);
                        setServerError('');
                    }}/>
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

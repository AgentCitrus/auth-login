"use client"

import { useEffect, useLayoutEffect, useState, useContext } from 'react';
import AuthContext from '../context/authcontext';
import axios from 'axios';
import Image from "next/image";
import { useRouter } from 'next/navigation';

export default function Profile() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [shouldRender, setShouldRender] = useState(false);
    const router = useRouter();

    useLayoutEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setShouldRender(false);
                router.push('/login');
            }

            await axios.get('http://localhost:5000/users', { headers: {
                    authorization: token
                }})
                .then(response => {
                    setShouldRender(true);
                    setUsername(response.data.username);
                    setEmail(response.data.email);
                })
                .catch(error => {
                    setShouldRender(false);
                    console.error(error);
                    router.push('/login');
                });
        }

        fetchUserInfo();
    }, [router]);

    return (
        shouldRender ? (
            <main className="flex justify-center items-center h-[calc(100vh_-_4rem)] relative bg-black border-white border px-14 py-14">
                {username}

            </main>
        ) : (
            null
        )
    );
}

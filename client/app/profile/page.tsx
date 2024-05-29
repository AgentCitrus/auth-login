"use client"

import { useEffect, useLayoutEffect, useState, useContext } from 'react';
import AuthContext from '../context/authcontext';
import axios from 'axios';
import Image from "next/image";
import { useRouter } from 'next/navigation';

export default function Profile() {
    const [username, setUsername] = useState('');
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
                    setUsername(response.data.username)
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
            <main className="mt-16 text-white">
                <p>hello {username}</p>
            </main>
        ) : (
            null
        )
    );
}

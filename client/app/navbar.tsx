"use client"
import { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthContext from './context/authcontext';
import axios from 'axios';

const Navbar = () => {
    const authContext = useContext(AuthContext);
    const router = useRouter();

    if (!authContext) {
        return null;
    }

    const { isAuthenticated, isLoading, logout } = authContext;

    const handleLogout = () => {
        logout();
        router.push('/');
    }

    function setLoginStatus(isAuthenticated : boolean, isLoading : boolean) {
        if (isLoading) {
            return null;
        } else if (isAuthenticated) {
            return (
                <>
                    <li className="inline-block m-5 float-right cursor-pointer"><a onClick={handleLogout}>Logout</a></li>
                </>
            );
        } else {
            return (
                <>
                    <li className="inline-block m-5 float-right"><Link href="/sign-up">Sign Up</Link></li>
                    <li className="inline-block m-5 float-right"><Link href="/login">Login</Link></li>
                </>
            );
        }
    }

    return (
        <nav>
            <ul className="bg-black fixed top-0 left-0 w-full list-none m-0 p-0 border-b border-white">
                <li className="inline-block p-5"><Link href="/">Home</Link></li>
                <li className="inline-block p-5"><Link href="/profile">Profile</Link></li>
                {setLoginStatus(isAuthenticated, isLoading)}
            </ul>
        </nav>
    )
};

export default Navbar;
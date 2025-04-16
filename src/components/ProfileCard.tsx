'use client';

import React, { useEffect, useState } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

// import { signIn, signOut, useSession } from "next-auth/react";

export default function ProfileCard() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        fetch("/api/me")
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            if (data?.userId) {
              setIsLoggedIn(true);
              setUserId(data.userId);
            }
          })
          .catch(() => setIsLoggedIn(false)); 
    }, []);

    const handleLogin = async () => {
        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: 1 }), // สมมุติ หรือใช้ form
        });
        if (res.ok) {
            setIsLoggedIn(true);
            setUserId(1);
        }
    };

    const handleLogout = async () => {
        await fetch("/api/logout", { method: "POST" }); // 👈 หรือใช้ clear cookie จาก client
        setIsLoggedIn(false);
        setUserId(null);
    };

    if (isLoggedIn) {
        return (
            <div className="flex items-center space-x-2 ml-3">
                <Menu as="div" className="relative ml-3">
                    <div>
                        <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                            <img
                                alt=""
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                className="size-8 rounded-full"
                            />
                        </MenuButton>
                    </div>
                    <MenuItems
                        transition
                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                    >
                        <MenuItem>
                        <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                        >
                            Your Profile
                        </a>
                        </MenuItem>
                        <MenuItem>
                        {/* <button
                            onClick={() => setIsLoggedIn(false)}
                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                        >
                            Sign out
                        </button> */}
                        <button
                            onClick={handleLogout}
                            className="block px-4 py-2 text-sm text-gray-700 w-full text-left"
                        >
                            Sign out
                        </button>
                        </MenuItem>
                    </MenuItems>
                </Menu>
            </div>
        );
    }
    return (
        <button
            onClick={handleLogin}
            className="bg-blue-500 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded"
        >
            Login
        </button>
    );  
}
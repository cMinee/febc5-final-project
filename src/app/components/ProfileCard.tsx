'use client';

import React, { useState } from 'react';

export default function ProfileCard() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    if (isLoggedIn) {
        return (
            <div className="flex items-center space-x-2">
                <img 
                    src="https://scontent.fbkk5-1.fna.fbcdn.net/v/t39.30808-6/449498249_3043511642457570_1350321673615048271_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=3H_zkkaa6tgQ7kNvgEVyNHf&_nc_oc=Adgk6P7IlWIxu8IM0RDDx2fTNJPClfE4ojDN2K_kJiqqXXmElrgxKt7-X3Qae1gkVBY&_nc_zt=23&_nc_ht=scontent.fbkk5-1.fna&_nc_gid=AiOq9RsP64yOgCli_p8L4-R&oh=00_AYApqou9PdpDAb5Z2v2zZxrsYedDNdQPyrngrsNy1MfHvA&oe=67CD85E1" 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full mr-4" 
                />
                <span className="text-lg font-semibold">John Doe</span>
                <button 
                    onClick={() => setIsLoggedIn(false)}
                    className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded text-sm">Logout</button>
            </div>
        );
    }
    return (
        <button onClick={() => setIsLoggedIn(true)} className="bg-blue-500 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded">
            Login
        </button>
    );  
}
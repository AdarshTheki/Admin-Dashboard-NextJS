'use client';

import React from 'react';

import { UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Users } from 'lucide-react';

import { navLinks } from '@/lib/constants';

const TopBar = () => {
    const [dropdownMenu, setDropdownMenu] = useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    const pathname = usePathname();
    const { isSignedIn } = useUser();

    React.useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
                setDropdownMenu(false);
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    return (
        <div>
            <div className='sticky top-0 z-20 w-full flex justify-between items-center p-4 bg-blue-1 shadow-xl lg:hidden'>
                <Image src='/logo.jpg' alt='logo' width={80} height={20} />

                {/* Menu Links */}
                <div className='flex gap-8 max-md:hidden'>
                    {navLinks.map((link) => (
                        <Link
                            href={link.url}
                            key={link.label}
                            className={`flex gap-2 text-body-medium ${
                                pathname === link.url ? 'text-white' : 'text-blue-3'
                            }`}>
                            <p>{link.label}</p>
                        </Link>
                    ))}
                </div>

                {/* DropDown Toggle */}
                <div className='relative flex gap-5 items-center' ref={dropdownRef}>
                    <Menu
                        className='text-white cursor-pointer md:hidden'
                        onClick={() => setDropdownMenu(!dropdownMenu)}
                    />
                    {dropdownMenu && (
                        <div className='absolute top-10 right-6 flex flex-col gap-8 p-5 bg-white shadow-xl rounded-lg'>
                            {navLinks.map((link) => (
                                <Link
                                    href={link.url}
                                    key={link.label}
                                    className='flex gap-2 items-center text-body-medium hover:text-blue-1'>
                                    {link.icon} <p>{link.label}</p>
                                </Link>
                            ))}
                        </div>
                    )}
                    {/* User Details */}
                    {isSignedIn ? (
                        <UserButton />
                    ) : (
                        <Link
                            href={'sign-in'}
                            className={`flex items-center gap-2 text-white hover:text-blue-300 cursor-pointer`}>
                            <Users fontSize={10} />
                            <p>Sign In</p>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopBar;

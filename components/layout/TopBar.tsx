'use client';

import React from 'react';

import { UserButton, useUser, SignInButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

import { navLinks } from '@/lib/constants';

const TopBar = () => {
    const [dropdownMenu, setDropdownMenu] = useState(false);
    const pathname = usePathname();
    const { isSignedIn } = useUser();

    return (
        <div>
            <div className='sticky top-0 z-20 w-full flex justify-between items-center px-8 py-4 bg-blue-2 shadow-xl lg:hidden'>
                <Image src='/logo.png' alt='logo' width={80} height={20} />

                {/* Menu Links */}
                <div className='flex gap-8 max-md:hidden'>
                    {navLinks.map((link) => (
                        <Link
                            href={link.url}
                            key={link.label}
                            className={`flex gap-4 text-body-medium ${
                                pathname === link.url ? 'text-blue-1' : 'text-grey-1'
                            }`}>
                            <p>{link.label}</p>
                        </Link>
                    ))}
                </div>

                {/* DropDown Toggle */}
                <div className='relative flex gap-4 items-center'>
                    <Menu
                        className='cursor-pointer md:hidden'
                        onClick={() => setDropdownMenu(!dropdownMenu)}
                    />
                    {dropdownMenu && (
                        <div className='absolute top-10 right-6 flex flex-col gap-8 p-5 bg-white shadow-xl rounded-lg'>
                            {navLinks.map((link) => (
                                <Link
                                    href={link.url}
                                    key={link.label}
                                    className='flex gap-4 text-body-medium'>
                                    {link.icon} <p>{link.label}</p>
                                </Link>
                            ))}
                        </div>
                    )}
                    {/* User Details */}
                    {isSignedIn ? (
                        <UserButton />
                    ) : (
                        <div className={`flex items-center justify-center w-fit text-green-1`}>
                            <SignInButton />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopBar;

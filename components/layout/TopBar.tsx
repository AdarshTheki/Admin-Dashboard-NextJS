'use client';

import React from 'react';

import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Slack, Users } from 'lucide-react';

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

    const toggleDropdown = () => setDropdownMenu(!dropdownMenu);

    return (
        <div>
            <div className='sticky top-0 z-20 w-full flex justify-between items-center p-4 bg-blue-1 shadow-xl lg:hidden'>
                <p className='flex gap-2 items-center cursor-pointer'>
                    <Slack color='#FFF' />
                    <span className='text-[#FFF] text-base-bold'>E-Shopify</span>
                </p>

                {/* Menu Links */}
                <div className='flex gap-8 max-md:hidden'>
                    {navLinks.map((link) => (
                        <Link
                            href={link.url}
                            key={link.label}
                            className={`flex gap-2 text-base-medium hover:text-blue-400 ${
                                pathname === link.url ? 'text-blue-400' : 'text-white'
                            }`}>
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* DropDown Toggle */}
                <div className='relative flex gap-5 items-center' ref={dropdownRef}>
                    {/* User Details */}
                    {isSignedIn ? (
                        <UserButton />
                    ) : (
                        <Link href='/sign-in' className='text-white hover:text-blue-300'>
                            Sign In
                        </Link>
                    )}
                    <Menu
                        className='text-white cursor-pointer md:hidden'
                        onClick={toggleDropdown}
                    />
                    {dropdownMenu && (
                        <div className='absolute overflow-hidden top-10 right-4 flex flex-col bg-white shadow-2xl rounded-2xl'>
                            {navLinks.map((link) => (
                                <Link
                                    onClick={toggleDropdown}
                                    href={link.url}
                                    key={link.label}
                                    className='flex border-b gap-2 hover:bg-gray-200 py-4 pl-8 pr-24 cursor-pointer items-center'>
                                    {link.icon} <span>{link.label}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopBar;

'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { navLinks } from '@/lib/constants';
import { Users } from 'lucide-react';

const LeftSideBar = () => {
    const pathname = usePathname();
    const { isSignedIn } = useUser();

    return (
        <div className='h-screen left-0 top-0 sticky p-10 flex flex-col gap-10 text-blue-3 bg-blue-1 shadow max-lg:hidden'>
            <Image src='/logo.jpg' alt='logo' width={120} height={50} />

            <div className='flex flex-col gap-12'>
                {navLinks.map((link) => (
                    <Link
                        href={link.url}
                        key={link.label}
                        className={`flex gap-2 text-body-medium items-center  hover:text-white ${
                            pathname === link.url ? 'text-white' : ''
                        }`}>
                        {link.icon} <p>{link.label}</p>
                    </Link>
                ))}
                {!isSignedIn ? (
                    <Link
                        href='sign-in'
                        className='flex items-center gap-2 text-body-medium hover:text-white'>
                        <Users /> <p>Sign In</p>
                    </Link>
                ) : (
                    <h2 className='flex items-center gap-2 text-body-medium hover:text-white'>
                        <UserButton />
                        <p>Profile</p>
                    </h2>
                )}
            </div>
        </div>
    );
};

export default LeftSideBar;

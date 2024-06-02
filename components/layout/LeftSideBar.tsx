'use client';

import { UserButton, useUser, SignInButton, SignOutButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { navLinks } from '@/lib/constants';

const LeftSideBar = () => {
    const pathname = usePathname();
    const { isSignedIn } = useUser();
    return (
        <div className='h-screen left-0 top-0 sticky p-10 flex flex-col gap-10 bg-blue-2 shadow max-lg:hidden'>
            <Image src='/logo.png' alt='logo' width={120} height={50} />

            <div className='flex flex-col gap-12'>
                {navLinks.map((link) => (
                    <Link
                        href={link.url}
                        key={link.label}
                        className={`flex gap-4 text-body-medium ${
                            pathname === link.url ? 'text-blue-1' : 'text-grey-1'
                        }`}>
                        {link.icon} <p>{link.label}</p>
                    </Link>
                ))}
            </div>

            <div className='text-body-medium items-center'>
                <div className='flex gap-4'>
                    <UserButton />
                    <p>Edit Profile</p>
                </div>
                <div
                    className={`mt-4 mx-auto w-fit flex items-center hover:opacity-90 justify-center ${
                        isSignedIn ? 'text-red-1' : 'text-green-1'
                    }`}>
                    {isSignedIn ? <SignOutButton /> : <SignInButton />}
                </div>
            </div>
        </div>
    );
};

export default LeftSideBar;

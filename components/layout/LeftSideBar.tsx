'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import { Slack } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { navLinks } from '@/lib/constants';
import { Users } from 'lucide-react';

const LeftSideBar = () => {
    const pathname = usePathname();
    const { isSignedIn } = useUser();

    return (
        <div className='h-screen left-0 top-0 sticky pt-10 min-w-[200px] border-r flex flex-col gap-10 max-lg:hidden'>
            <p className='flex pl-4 gap-2 items-center'>
                <Slack color='#845EC0' />
                <span className='text-[#845EC0] text-base-bold'>E-Shopify</span>
            </p>

            <div className='flex flex-col'>
                {navLinks.map((link) => (
                    <Link
                        href={link.url}
                        key={link.label}
                        className={`flex gap-2 pl-4 py-5 hover:bg-gray-200 text-base-medium items-center hover:text-blue-700 ${
                            pathname === link.url ? 'text-blue-600' : ''
                        }`}>
                        {link.icon} <p>{link.label}</p>
                    </Link>
                ))}
                {!isSignedIn ? (
                    <Link
                        href='/sign-in'
                        className='flex items-center pl-4 gap-2 py-4 text-body-medium hover:text-blue-600'>
                        <Users /> <p>Sign In</p>
                    </Link>
                ) : (
                    <h2 className='pl-4 gap-2 py-4 text-body-medium hover:text-blue-600'>
                        <UserButton showName />
                    </h2>
                )}
            </div>
        </div>
    );
};

export default LeftSideBar;

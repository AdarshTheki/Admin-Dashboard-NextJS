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
      <Link href='/' className='flex pl-6 gap-2 items-center'>
        <Slack />
        <span className='text-base-bold'>E-Shopify</span>
      </Link>

      <div className='flex flex-col gap-3 p-2'>
        {navLinks.map((link) => (
          <Link
            href={link.url}
            key={link.label}
            className={`flex gap-2 rounded-lg pl-4 duration-300 py-2 hover:bg-gray-200 text-base-medium items-center ${
              pathname === link.url ? 'text-blue-600' : ''
            }`}>
            {link.icon} <p>{link.label}</p>
          </Link>
        ))}
        {!isSignedIn ? (
          <Link
            href='/sign-in'
            className='flex gap-2 rounded-lg pl-4 duration-300 py-2 hover:bg-gray-200 text-base-medium items-center'>
            <Users /> <p>Sign In</p>
          </Link>
        ) : (
          <h2 className='flex gap-2 rounded-lg pl-4 duration-300 py-2 hover:bg-gray-200 text-base-medium items-center'>
            <UserButton showName />
          </h2>
        )}
      </div>
    </div>
  );
};

export default LeftSideBar;

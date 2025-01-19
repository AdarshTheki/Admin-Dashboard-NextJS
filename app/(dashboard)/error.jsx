'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className='flex h-screen items-center justify-center bg-gray-100'>
            <div className='text-center'>
                <h1 className='text-4xl font-bold text-gray-800'>Something went wrong</h1>
                <p className='mt-4 text-lg text-gray-600'>
                    We encountered an unexpected error. Please try again later.
                </p>
                <button className='mt-6 bg-red-500 hover:bg-red-600 text-white' onClick={reset}>
                    Try Again
                </button>
            </div>
        </div>
    );
}

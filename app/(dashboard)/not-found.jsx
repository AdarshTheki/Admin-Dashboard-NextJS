import Link from 'next/link';

export default function NotFound() {
    return (
        <div className='flex h-screen items-center justify-center bg-gray-100'>
            <div className='text-center'>
                <h1 className='text-6xl font-bold text-gray-800'>404</h1>
                <p className='mt-4 text-xl text-gray-600'>
                    Oops! The page you are looking for does not exist.
                </p>
                <Link href='/'>
                    <button className='mt-6 bg-blue-500 hover:bg-blue-600 text-white'>
                        Go Back Home
                    </button>
                </Link>
            </div>
        </div>
    );
}

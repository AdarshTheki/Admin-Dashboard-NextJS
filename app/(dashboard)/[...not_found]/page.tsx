export default function Error() {
  return (
    <div className='flex h-screen items-center justify-center bg-gray-100'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold text-gray-800'>Something went wrong</h1>
        <p className='mt-4 text-red-500'>
          {' '}
          We encountered an unexpected error. Please try again later.
        </p>
        <button
          className='mt-6 rounded-lg px-4 py-2 bg-red-500 hover:bg-red-600 text-white'
          aria-label='Try again after error'>
          Try Again
        </button>
      </div>
    </div>
  );
}

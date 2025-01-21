export default function Loading({ text }: { text?: string }) {
  return (
    <div className='relative h-screen flex items-center justify-center bg-gray-100'>
      {/* Loading spinner and text */}
      <div className='text-center'>
        <svg
          className='animate-spin h-12 w-12 text-blue-500 mx-auto'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'>
          <circle
            className='opacity-25'
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='4'></circle>
          <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8H4z'></path>
        </svg>
        <p className='mt-4 text-lg text-gray-600'>{text || 'Loading, please wait...'}</p>
      </div>
    </div>
  );
}

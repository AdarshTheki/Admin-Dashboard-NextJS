import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/sign-in', '/sign-up', '/api/:path*']);

export default clerkMiddleware({
    authorizedParties: [
        'http://localhost:3000',
        'http://localhost:4000',
        'https://admin-dashboard-next-js-xi.vercel.app',
        'https://ecommerce-store-next-js-five.vercel.app',
    ],
    clockSkewInMs: 1000 * 60 * 60 * 24 * 2,
});

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

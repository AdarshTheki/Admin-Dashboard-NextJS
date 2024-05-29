import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
    clockSkewInMs: 1000 * 60 * 60,
});

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

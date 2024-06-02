import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';

import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Admin Auth',
    description:
        "This e-commerce app, built using the MERN stack, offers a comprehensive platform for efficient data handling. With a user-friendly interface and robust functionality, our app ensures hassle-free administration of Adarsh's data.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang='en'>
                <body className={inter.className}>{children}</body>
            </html>
        </ClerkProvider>
    );
}

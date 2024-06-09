import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';

import { ClerkProvider } from '@clerk/nextjs';
import LeftSideBar from '@/components/layout/LeftSideBar';
import TopBar from '@/components/layout/TopBar';
import { ToasterProvider } from '@/lib/ToasterProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'E-Shopify Admin Dashboard',
    description:
        'E-Shopify Admin Dashboard provides comprehensive tools to manage your online store efficiently. Monitor sales, manage inventory, and streamline operations with our intuitive dashboard.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang='en'>
                <body className={inter.className}>
                    <div className='flex max-lg:flex-col text-grey-1'>
                        <ToasterProvider />
                        <LeftSideBar />
                        <TopBar />
                        <div className='flex-1'>{children}</div>
                    </div>
                </body>
            </html>
        </ClerkProvider>
    );
}

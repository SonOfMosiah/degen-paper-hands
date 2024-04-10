import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { siteConfig } from '../config/site'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Degen Paper Hands',
    description: 'Check how much you lost by selling too early',
    keywords: ['Degen', 'Farcaster', 'Frames'],
    authors: [
        {
            name: 'SonOfMosiah',
            url: 'https://github.com/SonOfMosiah',
        },
    ],
    creator: 'SonOfMosiah',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: siteConfig.url,
        title: siteConfig.name,
        description: siteConfig.description,
        siteName: siteConfig.name,
        images: [
            {
                url: `${siteConfig.url}/sad-paper-hands.png`,
                width: 1200,
                height: 630,
                alt: siteConfig.name,
            },
        ],
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    )
}

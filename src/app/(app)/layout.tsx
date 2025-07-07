import './globals.css'
import { Inter } from 'next/font/google'
import Script from 'next/script'

import NavBar from '@/components/NavBar/navbar-wrapper'
import Footer from '@/components/Footer'

import { sharedOpenGraphMetadata } from '@/lib/shared-metadata'

const inter = Inter({ subsets: ['latin'] })

const title = 'Star Athletics'
const description =
  "Fun-filled athletics in Sydney's Northern Beaches and Woolgoolga on the Mid-North Coast"

export const metadata = {
  metadataBase: new URL('https://star-athletics.com.au/'),
  title: {
    template: `%s | ${title}`,
    default: title,
  },
  description,
  openGraph: {
    title,
    description,
    ...sharedOpenGraphMetadata,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} grid min-h-screen grid-rows-[auto_1fr_auto]`}>
        {/* @ts-expect-error Server Component */}
        <NavBar />
        <main className="max-w-full overflow-x-hidden">{children}</main>
        {/* @ts-expect-error Server Component */}
        <Footer />

        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-4LQBP1B3ZB"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
  
    gtag('config', 'G-4LQBP1B3ZB');
    
    `}
        </Script>
      </body>
    </html>
  )
}

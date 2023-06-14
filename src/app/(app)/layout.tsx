import './globals.css'
import { Inter } from 'next/font/google'

import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

import { sharedOpenGraphMetadata } from '@/lib/shared-metadata'

const inter = Inter({ subsets: ['latin'] })

const title = 'Star Athletics'
const description =
  'Fun-filled athletics in Sydney’s Northern Beaches and Woolgoolga on the Mid-North Coast'

export const metadata = {
  metadataBase: new URL('https://star-athletics.vercel.app/'),
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
      <body className={`${inter.className} grid min-h-screen grid-rows-[auto,1fr,auto]`}>
        <NavBar />
        <main className="max-w-full overflow-x-hidden">{children}</main>
        {/* @ts-expect-error Server Component */}
        <Footer />
      </body>
    </html>
  )
}

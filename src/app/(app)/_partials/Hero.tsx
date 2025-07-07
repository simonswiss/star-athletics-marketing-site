import Image from 'next/image'
import Link from 'next/link'

import { reader } from '@/app/keystatic/reader'
import { DocumentRenderer } from '@keystatic/core/renderer'

export default async function Hero() {
  const data = await reader.singletons.homepage.read({ resolveLinkedFiles: true })
  const image1 = data?.heroImages[0]
  const image2 = data?.heroImages[1]
  const image3 = data?.heroImages[2]
  const image4 = data?.heroImages[3]
  const image5 = data?.heroImages[4]

  if (!image1 || !image2 || !image3 || !image4 || !image5) {
    throw new Error('Missing homepage hero images, make sure there are 5 images in the CMS.')
  }
  return (
    <div className="relative isolate">
      <svg
        className="absolute inset-x-0 top-0 -z-10 h-256 w-full stroke-gray-200 mask-[radial-gradient(32rem_32rem_at_center,white,transparent)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
            width={200}
            height={200}
            x="50%"
            y={-1}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
          <path
            d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
            strokeWidth={0}
          />
        </svg>
        <rect
          width="100%"
          height="100%"
          strokeWidth={0}
          fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)"
        />
      </svg>
      <div
        className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
        aria-hidden="true"
      >
        <div
          className="aspect-801/1036 w-200.25 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              'polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)',
          }}
        />
      </div>
      <div className="overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-36 sm:pb-32 sm:pt-60 lg:px-8 lg:pt-32">
          <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
            <div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Fun-filled athletics in{' '}
                <Link href="/sydney" className="text-sky-500 hover:underline">
                  Sydney’s Northern Beaches
                </Link>{' '}
                and{' '}
                <Link href="/woopi" className="text-purple-500 hover:underline">
                  Mid-North Coast Woopi
                </Link>
                .
              </h1>
              <div className="relative mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none">
                <DocumentRenderer document={data.heroIntroText} />
              </div>

              <div className="mt-10 flex items-center gap-x-6">
                <Link
                  href="/sydney/sessions"
                  className="rounded-md bg-sky-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-sky-600 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                >
                  Sydney sessions
                </Link>
                <Link
                  href="/woopi/sessions"
                  className="rounded-md bg-purple-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-purple-500 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                >
                  Woopi sessions
                </Link>
                {/* <Link href="/coaches" className="text-sm font-semibold leading-6 text-gray-900">
                  Meet the coaches <span aria-hidden="true">→</span>
                </Link> */}
              </div>
            </div>
            <div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
              <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-0 xl:pt-80">
                <div className="relative">
                  <Image
                    width={176}
                    height={176 * 1.5}
                    src={image1.url}
                    alt={image1.altText}
                    className="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                </div>
              </div>
              <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                <div className="relative">
                  <Image
                    width={176}
                    height={176 * 1.5}
                    src={image2.url}
                    alt={image2.altText}
                    className="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                </div>
                <div className="relative">
                  <Image
                    width={176}
                    height={176 * 1.5}
                    src={image3.url}
                    alt={image3.altText}
                    className="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                </div>
              </div>
              <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                <div className="relative">
                  <Image
                    width={176}
                    height={176 * 1.5}
                    src={image4.url}
                    alt={image4.altText}
                    className="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                </div>
                <div className="relative">
                  <Image
                    width={176}
                    height={176 * 1.5}
                    src={image5.url}
                    alt={image5.altText}
                    className="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

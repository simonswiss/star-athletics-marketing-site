import Image from 'next/image'

import { reader } from '@/app/keystatic/reader'
import { MdxRenderer } from '@/components/MdxRenderer'

export default async function Introduction() {
  const data = await reader.singletons.homepage.read({ resolveLinkedFiles: true })
  const bigImage = data?.bigImage
  if (!bigImage)
    throw new Error('Missing homepage big image, make sure there is an image in the CMS.')
  return (
    <>
      <div className="bg-white px-6 py-16 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-base font-semibold leading-7 text-purple-600">
            Your journey starts today
          </p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Let&apos;s run together!
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We are passionate about teaching children and adults a love of running through a dynamic
            and unique form of training. As running is the foundation of most sports, we strive to
            bring out the best in each individual.
          </p>
        </div>
      </div>

      <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <svg
            className="absolute left-[max(50%,25rem)] top-0 h-256 w-512 -translate-x-1/2 stroke-gray-200 mask-[radial-gradient(64rem_64rem_at_top,white,transparent)]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                width={200}
                height={200}
                x="50%"
                y={-1}
                patternUnits="userSpaceOnUse"
              >
                <path d="M100 200V.5M.5 .5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
              <path
                d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect
              width="100%"
              height="100%"
              strokeWidth={0}
              fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
            />
          </svg>
        </div>
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <p className="text-base font-semibold leading-7 text-purple-600">
                  {data.introductionEyebrow}
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  {data.introductionTitle}
                </h1>
                <p className="mt-6 text-xl leading-8 text-gray-700">{data.introductionLeadText}</p>
              </div>
            </div>
          </div>
          <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            <Image
              width={912}
              height={643}
              className="w-[130%] max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-228"
              src={bigImage.url}
              alt={bigImage.altText}
            />
          </div>
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="max-w-xl space-y-8 text-base leading-7 text-gray-700 lg:max-w-lg">
                <MdxRenderer content={data.introductionText} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

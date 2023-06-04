import Image from 'next/image'
import type { EntryWithResolvedLinkedFiles } from '@keystatic/core/reader'
import { DocumentRenderer } from '@keystatic/core/renderer'

import keystaticConfig from '@/app/keystatic/keystatic.config'

type Props = EntryWithResolvedLinkedFiles<
  (typeof keystaticConfig)['singletons']['woopiPage' | 'sydneyPage']
>

export function RegionOverview({ data }: { data: Props }) {
  return (
    <div className="overflow-hidden bg-white py-32">
      <div className="mx-auto max-w-7xl px-6 lg:flex lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 lg:mx-0 lg:min-w-full lg:max-w-none lg:flex-none lg:gap-y-8">
          <div className="lg:col-end-1 lg:w-full lg:max-w-lg lg:pb-8">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {data.title}
            </h2>
            <p className="mt-6 text-xl leading-8 text-gray-600">{data.leadText}</p>
            <div className="prose mt-6">
              <DocumentRenderer document={data.introText} />
            </div>
            <div className="mt-10 flex">
              <a
                href="/woopi/sessions"
                className="rounded-md bg-sky-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
              >
                {data.buttonText} <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-start justify-end gap-6 sm:gap-8 lg:contents">
            {data.images[0] && (
              <div className="w-0 flex-auto lg:ml-auto lg:w-auto lg:flex-none lg:self-end">
                <Image
                  height={800}
                  width={800}
                  src={data.images[0].url}
                  alt={data.images[0].altText}
                  className="aspect-[7/5] w-[37rem] max-w-none rounded-2xl bg-gray-50 object-cover"
                />
              </div>
            )}
            <div className="contents lg:col-span-2 lg:col-end-2 lg:ml-auto lg:flex lg:w-[37rem] lg:items-start lg:justify-end lg:gap-x-8">
              {data.images[1] && (
                <div className="order-first flex w-64 flex-none justify-end self-end lg:w-auto">
                  <Image
                    height={800}
                    width={800}
                    src={data.images[1].url}
                    alt={data.images[1].altText}
                    className="aspect-[4/3] w-[24rem] max-w-none flex-none rounded-2xl bg-gray-50 object-cover"
                  />
                </div>
              )}
              {data.images[2] && (
                <div className="flex w-96 flex-auto justify-end lg:w-auto lg:flex-none">
                  <Image
                    height={800}
                    width={800}
                    src={data.images[2].url}
                    alt={data.images[2].altText}
                    className="aspect-[7/5] w-[37rem] max-w-none flex-none rounded-2xl bg-gray-50 object-cover"
                  />
                </div>
              )}
              {data.images[3] && (
                <div className="hidden sm:block sm:w-0 sm:flex-auto lg:w-auto lg:flex-none">
                  <Image
                    height={800}
                    width={800}
                    src={data.images[3].url}
                    alt={data.images[3].altText}
                    className="aspect-[4/3] w-[24rem] max-w-none rounded-2xl bg-gray-50 object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

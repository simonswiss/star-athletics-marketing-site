import Image from 'next/image'
import { DocumentRenderer } from '@keystatic/core/renderer'
import { EntryWithResolvedLinkedFiles } from '@keystatic/core/reader'
import keystaticConfig from '@/app/keystatic/keystatic.config'
import { CalComBooking } from './cal-com/booking'

type Props = {
  data: EntryWithResolvedLinkedFiles<(typeof keystaticConfig)['singletons']['sydneyHolidayCamps']>
}

export async function PlaceholderPage({ data }: Props) {
  const ContentSection = () => (
    <div className="text-base leading-7 text-gray-700">
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        {data.title}
      </h1>
      <div className="prose mt-6 max-w-xl break-all">
        <DocumentRenderer
          document={data.document}
          renderers={{
            block: {
              image: (props: { src: string; alt: string }) => (
                <Image
                  src={props.src}
                  alt={props.alt}
                  width={800}
                  height={600}
                  className="h-auto w-full rounded-lg shadow-lg"
                />
              ),
            },
          }}
        />
      </div>
      {data.calComBooking && (
        <div className="mt-8">
          <CalComBooking booking={data.calComBooking} />
        </div>
      )}
    </div>
  )

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {data.image ? (
          <div className="mx-auto grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-16 sm:gap-y-24 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pr-4">
              <Image
                src={data.image}
                alt={data.title}
                className="rounded-lg shadow-lg"
                height={800}
                width={800}
              />
            </div>
            <div>
              <ContentSection />
            </div>
          </div>
        ) : (
          <div>
            <ContentSection />
          </div>
        )}
      </div>
    </div>
  )
}

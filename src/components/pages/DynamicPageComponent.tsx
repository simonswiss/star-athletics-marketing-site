import { DocumentRenderer } from '@keystatic/core/renderer'
import { CalComBooking } from '@/components/cal-com/booking'
import Image from 'next/image'

interface DynamicPageProps {
  page: {
    title: string
    metaDescription?: string
    heroImage?: string | null
    content: any
    booking: {
      discriminant: boolean
      value: any
    }
  }
}

export function DynamicPageComponent({ page }: DynamicPageProps) {
  const { title, heroImage, content, booking } = page

  const ContentSection = () => (
    <div className="text-base leading-7 text-gray-700">
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{title}</h1>
      <div className="prose mt-6 max-w-xl">
        <DocumentRenderer
          document={content}
          renderers={{
            block: {
              // @ts-expect-error
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
      {booking.discriminant && (
        <div className="mt-8">
          <CalComBooking booking={booking.value} />
        </div>
      )}
    </div>
  )

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {heroImage ? (
          <div className="mx-auto grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-16 sm:gap-y-24 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pr-4">
              <Image
                src={heroImage}
                alt={title}
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

import Image from 'next/image'
import { reader } from '@/app/keystatic/reader'

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ')
}

export default async function Example() {
  const homepageData = await reader.singletons.homepage.read()
  const primaryTestimonialSlug = homepageData?.primaryTestimonial
  if (!primaryTestimonialSlug) throw new Error('Missing primary testimonial')

  const testimonials = await reader.collections.testimonials.all()
  const featuredTestimonial = await reader.collections.testimonials.read(primaryTestimonialSlug)

  // Take all testimonials except the featured one,
  // split them in 4 groups for "masonry" grid.
  const intermediateArray = Array.from({ length: 4 }, (_, i) =>
    testimonials
      .filter((testimonial) => testimonial.slug !== primaryTestimonialSlug)
      .filter((_, index) => index % 4 === i)
  )

  const groupedTestimonials = []
  for (let i = 0; i < intermediateArray.length; i += 2) {
    groupedTestimonials.push(intermediateArray.slice(i, i + 2))
  }

  if (!featuredTestimonial) throw new Error('Missing featured testimonial')
  return (
    <div className="relative isolate bg-white pb-32 pt-24 sm:pt-32">
      <div
        className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-30 blur-3xl"
        aria-hidden="true"
      >
        <div
          className="ml-[max(50%,38rem)] aspect-1313/771 w-328.25 bg-linear-to-tr from-[#ff80b5] to-[#9089fc]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      <div
        className="absolute inset-x-0 top-0 -z-10 flex transform-gpu overflow-hidden pt-32 opacity-25 blur-3xl sm:pt-40 xl:justify-end"
        aria-hidden="true"
      >
        <div
          className="-ml-88 aspect-1313/771 w-328.25 flex-none origin-top-right rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] xl:ml-0 xl:mr-[calc(50%-12rem)]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-purple-600">
            Don&apos;t take our word for it
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            See what our community has to say about Star Athletics
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">
          {/* Featured Testimonial */}
          <figure className="col-span-2 hidden sm:block sm:rounded-2xl sm:bg-white sm:shadow-lg sm:ring-1 sm:ring-gray-900/5 xl:col-start-2 xl:row-end-1">
            <blockquote className="p-12 text-xl font-semibold leading-8 tracking-tight text-gray-900">
              <p>{`“${featuredTestimonial.testimonial}”`}</p>
            </blockquote>
            {featuredTestimonial.avatar ? (
              <figcaption className="flex items-center gap-x-4 border-t border-gray-900/10 px-6 py-4">
                <Image
                  width={40}
                  height={40}
                  className="h-10 w-10 flex-none rounded-full bg-gray-50"
                  src={featuredTestimonial.avatar}
                  alt=""
                />
                <div className="flex-auto">
                  <div className="font-semibold">{featuredTestimonial.name}</div>
                  <div className="text-gray-600">{featuredTestimonial.role}</div>
                </div>
              </figcaption>
            ) : (
              <div className="flex-auto">
                <div className="font-semibold">{featuredTestimonial.name}</div>
                <div className="text-gray-600">{featuredTestimonial.role}</div>
              </div>
            )}
          </figure>
          {groupedTestimonials.map((columnGroup, columnGroupIdx) => (
            <div key={columnGroupIdx} className="space-y-8 xl:contents xl:space-y-0">
              {columnGroup.map((column, columnIdx) => (
                <div
                  key={columnIdx}
                  className={classNames(
                    (columnGroupIdx === 0 && columnIdx === 0) ||
                      (columnGroupIdx === groupedTestimonials.length - 1 &&
                        columnIdx === columnGroup.length - 1)
                      ? 'xl:row-span-2'
                      : 'xl:row-start-1',
                    'space-y-8'
                  )}
                >
                  {column.map((testimonial) => (
                    <figure
                      key={testimonial.slug}
                      className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5"
                    >
                      <blockquote className="text-gray-900">
                        <p>{`“${testimonial.entry.testimonial}”`}</p>
                      </blockquote>
                      {testimonial.entry.avatar ? (
                        <figcaption className="mt-6 flex items-center gap-x-4">
                          <Image
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full bg-gray-50"
                            src={testimonial.entry.avatar}
                            alt=""
                          />
                          <div>
                            <div className="font-semibold">{testimonial.entry.name}</div>
                            <div className="text-gray-600">{testimonial.entry.role}</div>
                          </div>
                        </figcaption>
                      ) : (
                        <div>
                          <div className="font-semibold">{testimonial.entry.name}</div>
                          <div className="text-gray-600">{testimonial.entry.role}</div>
                        </div>
                      )}
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

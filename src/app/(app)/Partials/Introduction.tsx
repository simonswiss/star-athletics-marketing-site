import Image from 'next/image'

import { reader } from '@/app/keystatic/reader'

export default async function Introduction() {
  const data = await reader.singletons.homepage.read()
  const bigImage = data?.bigImage
  if (!bigImage)
    throw new Error('Missing homepage big image, make sure there is an image in the CMS.')
  return (
    <>
      <div className="bg-white px-6 py-24 sm:py-32 lg:px-8">
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
            className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
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
                  It&apos;s more than running.
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  A way of life.
                </h1>
                <p className="mt-6 text-xl leading-8 text-gray-700">
                  Beyond improving performance, we also build confidence, focus and concentration.
                  We firmly believe that a strong mind and fit body are key components to success
                  and happiness in life.
                </p>
              </div>
            </div>
          </div>
          <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            <Image
              width={912}
              height={643}
              className="w-[48rem] max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
              src={bigImage.url}
              alt={bigImage.altText}
            />
          </div>
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="max-w-xl text-base leading-7 text-gray-700 lg:max-w-lg">
                <p>
                  Our classes for children are aimed at developing good technique and a life-long
                  desire to run and stay fit. By planting the seeds for success through
                  individualised goal-setting, children learn about the pleasure of setting and
                  achieving goals – all within a safe, monitored framework.
                </p>
                {/* <ul
                                    role="list"
                                    className="mt-8 space-y-8 text-gray-600"
                                >
                                    <li className="flex gap-x-3">
                                        <CloudArrowUpIcon
                                            className="mt-1 h-5 w-5 flex-none text-purple-600"
                                            aria-hidden="true"
                                        />
                                        <span>
                                            <strong className="font-semibold text-gray-900">
                                                Push to deploy.
                                            </strong>{" "}
                                            Lorem ipsum, dolor sit amet
                                            consectetur adipisicing elit.
                                            Maiores impedit perferendis suscipit
                                            eaque, iste dolor cupiditate
                                            blanditiis ratione.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3">
                                        <LockClosedIcon
                                            className="mt-1 h-5 w-5 flex-none text-purple-600"
                                            aria-hidden="true"
                                        />
                                        <span>
                                            <strong className="font-semibold text-gray-900">
                                                SSL certificates.
                                            </strong>{" "}
                                            Anim aute id magna aliqua ad ad non
                                            deserunt sunt. Qui irure qui lorem
                                            cupidatat commodo.
                                        </span>
                                    </li>
                                    <li className="flex gap-x-3">
                                        <ServerIcon
                                            className="mt-1 h-5 w-5 flex-none text-purple-600"
                                            aria-hidden="true"
                                        />
                                        <span>
                                            <strong className="font-semibold text-gray-900">
                                                Database backups.
                                            </strong>{" "}
                                            Ac tincidunt sapien vehicula erat
                                            auctor pellentesque rhoncus. Et
                                            magna sit morbi lobortis.
                                        </span>
                                    </li>
                                </ul> */}
                <p className="mt-8">
                  Teenagers, whose bodies and brains are going through tremendous physical and
                  chemical changes throughout adolescence, benefit from physical challenges that
                  either sharpen their existing sporting skills or establish the fitness foundation
                  that they may not yet have developed.
                </p>{' '}
                <p className="mt-8">
                  Achieving personal bests in a social environment outside their usual circle of
                  friends and school peers is very motivating.
                </p>
                <p className="mt-8">
                  Come join the fun - we&apos;re looking forward to meeting you!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { twMerge } from 'tailwind-merge'
import {
  ArrowPathIcon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  AcademicCapIcon,
  PhotoIcon,
  SparklesIcon,
  StarIcon,
  ListBulletIcon,
  FaceSmileIcon,
  MapIcon,
} from '@heroicons/react/24/outline'

import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
  ChatBubbleOvalLeftIcon,
} from '@heroicons/react/20/solid'

const iconsLookup: Record<string, typeof ArrowPathIcon> = {
  ArrowPathIcon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  PhoneIcon,
  PlayCircleIcon,
  AcademicCapIcon,
  PhotoIcon,
  SparklesIcon,
  StarIcon,
  ListBulletIcon,
  FaceSmileIcon,
  MapIcon,
  ChatBubbleOvalLeftIcon,
}

type ItemProps = {
  name: string
  items: {
    name: string
    description: string
    href: string
    icon: string
  }[]
  callsToAction: {
    name: string
    href: string
    icon: string
  }[]
}

export function RegionPopover({ region }: { region: ItemProps }) {
  return (
    <Popover className="relative">
      <Popover.Button
        className={twMerge(
          'flex items-center gap-x-1 text-sm font-semibold leading-6 focus:outline-none focus:ring focus:ring-offset-2',
          region.name === 'Sydney'
            ? 'text-purple-800 ring-purple-200'
            : ' text-sky-800 ring-sky-200'
        )}
      >
        {region.name}
        <ChevronDownIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
          <div className="p-4">
            {region.items.map((item) => {
              const Icon = iconsLookup[item.icon]
              return (
                <div
                  key={item.name}
                  className={twMerge(
                    'group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6',
                    region.name === 'Sydney' ? 'hover:bg-purple-50' : 'hover:bg-sky-50'
                  )}
                >
                  <div
                    className={twMerge(
                      'flex h-11 w-11 flex-none items-center justify-center rounded-lg',
                      region.name === 'Sydney'
                        ? 'bg-purple-50 group-hover:bg-purple-100'
                        : 'bg-sky-50 group-hover:bg-sky-100'
                    )}
                  >
                    <Icon
                      className={twMerge(
                        'h-6 w-6',
                        region.name === 'Sydney'
                          ? 'text-gray-600 group-hover:text-purple-600'
                          : 'text-gray-600 group-hover:text-sky-500'
                      )}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-auto">
                    <a
                      href={item.href}
                      className={twMerge(
                        'block font-semibold',
                        region.name === 'Sydney' ? 'text-purple-900' : 'text-sky-900'
                      )}
                    >
                      {item.name}
                      <span className="absolute inset-0" />
                    </a>
                    <p className="mt-1 text-gray-600">{item.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
          <div
            className={twMerge(
              'grid grid-cols-2 divide-x',
              region.name === 'Sydney'
                ? 'divide-purple-900/5 bg-purple-50'
                : 'divide-sky-900/5 bg-sky-50'
            )}
          >
            {region.callsToAction.map((item) => {
              const Icon = iconsLookup[item.icon]
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={twMerge(
                    'flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6',
                    region.name === 'Sydney'
                      ? 'text-purple-900 hover:bg-purple-100'
                      : 'text-sky-900 hover:bg-sky-100'
                  )}
                >
                  <Icon
                    className={twMerge(
                      'h-5 w-5 flex-none',
                      region.name === 'Sydney' ? 'text-purple-600' : 'text-sky-600'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              )
            })}
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}

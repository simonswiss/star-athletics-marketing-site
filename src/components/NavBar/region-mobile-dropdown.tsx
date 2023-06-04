import { twMerge } from 'tailwind-merge'
import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

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

export function RegionMobileDropdown({ region }: { region: ItemProps }) {
  return (
    <Disclosure as="div" className="-mx-3">
      {({ open }) => (
        <>
          <Disclosure.Button
            className={twMerge(
              'flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50',
              region.name === 'Sydney' ? 'hover:bg-purple-100' : 'hover:bg-sky-100'
            )}
          >
            {region.name}
            <ChevronDownIcon
              className={twMerge(open ? 'rotate-180' : '', 'h-5 w-5 flex-none')}
              aria-hidden="true"
            />
          </Disclosure.Button>
          <Disclosure.Panel className="mt-2 space-y-2">
            {[...region.items, ...region.callsToAction].map((item) => (
              <Disclosure.Button
                key={item.name}
                as="a"
                href={item.href}
                className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
              >
                {item.name}
              </Disclosure.Button>
            ))}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

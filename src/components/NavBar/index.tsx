'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Dialog, Popover } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { twMerge } from 'tailwind-merge'

import { Logo } from '@/components/Logo'
import { RegionPopover } from './region-popover'
import { RegionMobileDropdown } from './region-mobile-dropdown'

type NavigationData = {
  sydney: {
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
  woopi: {
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
  links: readonly {
    readonly name: string
    readonly href: string
  }[]
}

export default function Example({ navigation }: { navigation: NavigationData }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <header className="absolute inset-x-0 top-0 z-10">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Logo className="h-10" />
        </div>

        {/* Hamburger */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Sydney & Woopi Popovers */}
        <Popover.Group className="hidden lg:flex lg:gap-x-12">
          <RegionPopover region={navigation.sydney} />
          <RegionPopover region={navigation.woopi} />

          {navigation.links.map((link) => {
            const isActive = pathname?.startsWith(link.href)
            return (
              <Link
                className={twMerge(
                  'border-b-2 border-transparent text-sm font-semibold leading-6 text-gray-900',
                  isActive && 'border-gray-900'
                )}
                key={link.name}
                href={link.href}
              >
                {link.name}
              </Link>
            )
          })}
        </Popover.Group>

        {/* Log in link */}
        <div className="hidden flex-1 items-center justify-end gap-x-6 lg:flex">
          <Link
            href="/contact"
            className={twMerge(
              'border-b-2 border-transparent lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900',
              pathname === '/contact' && 'border-gray-900'
            )}
          >
            Contact
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Mobile dialog */}
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Logo className="h-8" />
            {/* Close button */}
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <RegionMobileDropdown region={navigation.sydney} />
                <RegionMobileDropdown region={navigation.woopi} />
                {navigation.links.map((link) => {
                  const isActive = pathname?.startsWith(link.href)
                  return (
                    <Link
                      className={twMerge(
                        '-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50',
                        isActive && 'underline decoration-2'
                      )}
                      key={link.name}
                      href={link.href}
                    >
                      {link.name}
                    </Link>
                  )
                })}
              </div>
              <div className="py-6">
                <Link
                  href="/contact"
                  className={twMerge(
                    '-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50',
                    pathname === '/contact' && 'underline decoration-2'
                  )}
                >
                  Contact
                </Link>
                <Link
                  href="/register"
                  className="mt-4 block w-full rounded-md bg-purple-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}

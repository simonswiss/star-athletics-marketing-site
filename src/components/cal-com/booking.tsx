'use client'

import Cal, { getCalApi } from '@calcom/embed-react'
import { useEffect } from 'react'

type Props = {
  booking: {
    eventSlug: string
    label: string
    display: 'button' | 'calendar'
  }
}

export function CalComBooking({ booking }: Props) {
  const { eventSlug, label, display = 'button' } = booking

  useEffect(() => {
    ;(async function () {
      const cal = await getCalApi({ namespace: eventSlug })
      cal('ui', {
        hideEventTypeDetails: false,
        layout: 'month_view',
        theme: 'light',
        cssVarsPerTheme: {
          light: {
            'cal-brand': '#9333ea',
          },
          dark: {
            'cal-brand': '#fafafa',
          },
        },
      })
    })()
  }, [eventSlug])

  if (display === 'calendar') {
    return (
      <>
        <h2 className="mb-2 text-lg font-semibold">{label}</h2>
        <Cal
          namespace={eventSlug}
          calLink={eventSlug}
          style={{ width: '100%', height: '100%', overflow: 'scroll' }}
          config={{ layout: 'month_view' }}
        />
      </>
    )
  }

  return (
    <button
      data-cal-namespace={eventSlug}
      data-cal-link={eventSlug}
      data-cal-config='{"layout":"month_view"}'
      className="rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
    >
      {label}
    </button>
  )
}

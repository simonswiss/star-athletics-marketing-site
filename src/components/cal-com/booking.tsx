'use client'

import Cal, { getCalApi } from '@calcom/embed-react'
import { useEffect } from 'react'

type Props = {
  booking: {
    eventString: string
    label: string
    display: 'button' | 'calendar'
  }
}

export function CalComBooking({ booking }: Props) {
  const { eventString, label, display = 'button' } = booking

  useEffect(() => {
    ;(async function () {
      const cal = await getCalApi({ namespace: eventString })
      cal('ui', {
        hideEventTypeDetails: false,
        layout: 'month_view',
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
  }, [eventString])

  if (display === 'calendar') {
    return (
      <>
        <h2 className="mb-2 text-lg font-semibold">Book via Cal.com</h2>
        <Cal
          namespace={eventString}
          calLink={`star-athletics/${eventString}`}
          style={{ width: '100%', height: '100%', overflow: 'scroll' }}
          config={{ layout: 'month_view' }}
        />
      </>
    )
  }

  return (
    <button
      data-cal-namespace={eventString}
      data-cal-link={`star-athletics/${eventString}`}
      data-cal-config='{"layout":"month_view"}'
      className="rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
    >
      {label}
    </button>
  )
}

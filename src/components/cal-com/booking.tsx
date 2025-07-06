'use client'

import Cal, { getCalApi } from '@calcom/embed-react'
import clsx from 'clsx'
import { useEffect } from 'react'

type Props = {
  booking: {
    eventSlug: string
    label: string
    display: 'button' | 'calendar'
  }
}

const brandColors = {
  sydney: '#0ea5e9',
  woopi: '#9333ea',
}

export function CalComBooking({ booking }: Props) {
  const { eventSlug, label, display = 'button' } = booking

  const isWoopi = eventSlug.startsWith('star-athletics/')

  useEffect(() => {
    ;(async function () {
      const cal = await getCalApi({ namespace: eventSlug })
      cal('ui', {
        hideEventTypeDetails: false,
        layout: 'month_view',
        theme: 'light',
        cssVarsPerTheme: {
          light: {
            'cal-brand': isWoopi ? brandColors.woopi : brandColors.sydney,
          },
          dark: {
            'cal-brand': '#fafafa',
          },
        },
      })
    })()
  }, [eventSlug, isWoopi])

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
      className={clsx(
        'rounded-md  px-3 py-2 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        isWoopi
          ? 'bg-purple-600 hover:bg-purple-500 focus-visible:outline-purple-600'
          : 'bg-sky-500 hover:bg-sky-400 focus-visible:outline-sky-500'
      )}
    >
      {label}
    </button>
  )
}

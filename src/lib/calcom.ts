interface CalComEventType {
  id: number
  title: string
  slug: string
  length: number
  price: number
  currency: string
  description?: string
  locations?: Array<{
    type: string
    address?: string
  }>
  seatsPerTimeSlot?: number
}

interface CalComSession {
  name: string
  slug: string
  day: string
  startTime: string
  endTime: string
  location: string
  capacity: number
  enrolments: number
  description: string
  price: string
  status: string
  bookingFormUrl: string
  calComId: number
  isEventType?: boolean
  source?: string
}

export async function fetchCalComEventTypes(
  region: 'woopi' | 'sydney' = 'woopi'
): Promise<CalComSession[]> {
  try {
    // Get API key based on region
    const API_KEY =
      region === 'woopi' ? process.env.CALCOM_WOOPI_API_KEY : process.env.CALCOM_SYDNEY_API_KEY

    if (!API_KEY) {
      return []
    }

    const headers = {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    }

    // Fetch personal event types (for free accounts)
    const response = await fetch('https://api.cal.com/v2/event-types', {
      headers,
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()

    // Extract event types from the response structure
    const eventTypeGroups = data.data?.eventTypeGroups || []
    const allEventTypes: CalComEventType[] = []

    for (const group of eventTypeGroups) {
      if (group.eventTypes && Array.isArray(group.eventTypes)) {
        allEventTypes.push(...group.eventTypes)
      }
    }

    return transformEventTypesToSessions(allEventTypes)
  } catch (error) {
    // Silently fail - we don't want Cal.com issues to break the page
    return []
  }
}

function transformEventTypesToSessions(eventTypes: CalComEventType[]): CalComSession[] {
  return eventTypes.map((eventType) => {
    // Format price
    const priceFormatted = `$${(eventType.price / 100).toFixed(0)} ${
      eventType.currency?.toUpperCase() || 'AUD'
    }`

    // Get location
    const location =
      eventType.locations?.find((loc) => loc.address)?.address ||
      eventType.locations?.[0]?.type ||
      'Location TBD'

    // Create booking URL
    const bookingUrl = `https://cal.com/star-athletics/${eventType.slug}`

    return {
      name: eventType.title,
      slug: eventType.slug,
      day: 'Multiple days available',
      startTime: 'Flexible',
      endTime: `${eventType.length} min duration`,
      location: location,
      capacity: eventType.seatsPerTimeSlot || 1,
      enrolments: 0,
      description: eventType.description || `${eventType.length} minute session`,
      price: priceFormatted,
      status: 'Available',
      bookingFormUrl: bookingUrl,
      calComId: eventType.id,
      isEventType: true,
      source: 'calcom',
    }
  })
}

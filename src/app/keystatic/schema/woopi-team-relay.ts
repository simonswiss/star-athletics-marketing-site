import { singleton, fields } from '@keystatic/core'
import { calComBooking } from '../fields/cal-com-booking'

export const woopiTeamRelay = singleton({
  label: 'Woopi Team Relay Training',
  path: 'src/content/woopi-team-relay',
  schema: {
    title: fields.text({ label: 'Title' }),
    image: fields.image({
      label: 'Image',
      directory: 'public/images/woopi-team-relay',
      publicPath: '/images/woopi-team-relay/',
    }),
    document: fields.document({
      label: 'Lead Text',
      formatting: true,
      links: true,
      images: {
        directory: 'public/images/woopi-team-relay',
        publicPath: '/images/woopi-team-relay/',
      },
    }),
    calComBooking,
  },
})

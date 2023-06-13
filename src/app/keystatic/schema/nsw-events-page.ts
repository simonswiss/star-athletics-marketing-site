import { singleton, fields } from '@keystatic/core'

export const nswEventsPage = singleton({
  label: 'NSW Events Page',
  path: 'src/content/nsw-events',
  schema: {
    title: fields.text({ label: 'Title' }),
    image: fields.image({
      label: 'Image',
      directory: 'public/images/nsw-events',
      publicPath: '/images/nsw-events/',
    }),
    document: fields.document({ label: 'Lead Text', formatting: true, links: true, images: true }),
  },
})

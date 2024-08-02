import { singleton, fields } from '@keystatic/core'

export const nswEventsPage = singleton({
  label: 'NSW Events Page',
  path: 'src/content/nsw-events',
  format: {
    contentField: 'leadText',
  },
  schema: {
    title: fields.text({ label: 'Title' }),
    image: fields.image({
      label: 'Image',
      directory: 'public/images/nsw-events',
      publicPath: '/images/nsw-events/',
    }),
    leadText: fields.mdx({
      label: 'Lead Text',
      options: {
        image: {
          directory: 'public/images/nsw-events',
          publicPath: '/images/nsw-events/',
        },
      },
    }),
  },
})

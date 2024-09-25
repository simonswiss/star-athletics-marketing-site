import { singleton, fields } from '@keystatic/core'

export const partnerships = singleton({
  label: 'Partnerships',
  path: 'src/content/partnerships',
  schema: {
    title: fields.text({ label: 'Title' }),
    image: fields.image({
      label: 'Image',
      directory: 'public/images/partnerships',
      publicPath: '/images/partnerships/',
    }),
    document: fields.document({
      label: 'Lead Text',
      formatting: true,
      links: true,
      images: {
        directory: 'public/images/partnerships',
        publicPath: '/images/partnerships/',
      },
    }),
  },
})

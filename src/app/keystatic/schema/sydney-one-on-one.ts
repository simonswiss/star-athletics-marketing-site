import { singleton, fields } from '@keystatic/core'

export const sydneyOneOnOne = singleton({
  label: 'Sydney One-on-one',
  path: 'src/content/sydney-one-on-one',
  schema: {
    title: fields.text({ label: 'Title' }),
    image: fields.image({
      label: 'Image',
      directory: 'public/images/sydney-one-on-one',
      publicPath: '/images/sydney-one-on-one/',
    }),
    document: fields.document({
      label: 'Lead Text',
      formatting: true,
      links: true,
      images: {
        directory: 'public/images/sydney-one-on-one',
        publicPath: '/images/sydney-one-on-one/',
      },
    }),
  },
})

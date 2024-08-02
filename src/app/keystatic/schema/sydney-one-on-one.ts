import { singleton, fields } from '@keystatic/core'

export const sydneyOneOnOne = singleton({
  label: 'Sydney One-on-one',
  path: 'src/content/sydney-one-on-one',
  format: {
    contentField: 'leadText',
  },
  schema: {
    title: fields.text({ label: 'Title' }),
    image: fields.image({
      label: 'Image',
      directory: 'public/images/sydney-one-on-one',
      publicPath: '/images/sydney-one-on-one/',
    }),
    leadText: fields.mdx({
      label: 'Lead Text',
      options: {
        image: {
          directory: 'public/images/sydney-one-on-one',
          publicPath: '/images/sydney-one-on-one/',
        },
      },
    }),
  },
})

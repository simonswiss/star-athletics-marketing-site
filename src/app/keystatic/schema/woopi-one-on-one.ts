import { singleton, fields } from '@keystatic/core'

export const woopiOneOnOne = singleton({
  label: 'Woopi One-on-one',
  path: 'src/content/woopi-one-on-one',
  format: {
    contentField: 'leadText',
  },
  schema: {
    title: fields.text({ label: 'Title' }),
    image: fields.image({
      label: 'Image',
      directory: 'public/images/woopi-one-on-one',
      publicPath: '/images/woopi-one-on-one/',
    }),
    leadText: fields.mdx({
      label: 'Lead Text',
      options: {
        image: {
          directory: 'public/images/woopi-one-on-one',
          publicPath: '/images/woopi-one-on-one/',
        },
      },
    }),
  },
})

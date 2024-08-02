import { singleton, fields } from '@keystatic/core'

export const woopiSchools = singleton({
  label: 'Woopi Schools',
  path: 'src/content/woopi-schools',
  format: {
    contentField: 'leadText',
  },
  schema: {
    title: fields.text({ label: 'Title' }),
    image: fields.image({
      label: 'Image',
      directory: 'public/images/woopi-schools',
      publicPath: '/images/woopi-schools/',
    }),
    leadText: fields.mdx({
      label: 'Lead Text',
      options: {
        image: {
          directory: 'public/images/woopi-schools',
          publicPath: '/images/woopi-schools/',
        },
      },
    }),
  },
})

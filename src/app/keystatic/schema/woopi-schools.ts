import { singleton, fields } from '@keystatic/core'

export const woopiSchools = singleton({
  label: 'Woopi Schools',
  path: 'src/content/woopi-schools',
  schema: {
    title: fields.text({ label: 'Title' }),
    image: fields.image({
      label: 'Image',
      directory: 'public/images/woopi-schools',
      publicPath: '/images/woopi-schools/',
    }),
    document: fields.document({
      label: 'Lead Text',
      formatting: true,
      links: true,
      images: {
        directory: 'public/images/woopi-schools',
        publicPath: '/images/woopi-schools/',
      },
    }),
  },
})

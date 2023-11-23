import { singleton, fields } from '@keystatic/core'

export const woopiHolidayCamps = singleton({
  label: 'Woopi Holiday Camps',
  path: 'src/content/woopi-holiday-camps',
  schema: {
    title: fields.text({ label: 'Title' }),
    image: fields.image({
      label: 'Image',
      directory: 'public/images/woopi-holiday-camps',
      publicPath: '/images/woopi-holiday-camps/',
    }),
    document: fields.document({
      label: 'Lead Text',
      formatting: true,
      links: true,
      images: {
        directory: 'public/images/woopi-holiday-camps',
        publicPath: '/images/woopi-holiday-camps/',
      },
    }),
  },
})

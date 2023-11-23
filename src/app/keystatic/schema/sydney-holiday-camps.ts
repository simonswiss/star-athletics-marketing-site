import { singleton, fields } from '@keystatic/core'

export const sydneyHolidayCamps = singleton({
  label: 'Sydney Holiday Camps',
  path: 'src/content/sydney-holiday-camps',
  schema: {
    title: fields.text({ label: 'Title' }),
    image: fields.image({
      label: 'Image',
      directory: 'public/images/sydney-holiday-camps',
      publicPath: '/images/sydney-holiday-camps/',
    }),
    document: fields.document({
      label: 'Lead Text',
      formatting: true,
      links: true,
      images: {
        directory: 'public/images/sydney-holiday-camps',
        publicPath: '/images/sydney-holiday-camps/',
      },
    }),
  },
})

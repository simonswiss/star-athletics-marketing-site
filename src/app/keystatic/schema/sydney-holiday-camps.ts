import { singleton, fields } from '@keystatic/core'

export const sydneyHolidayCamps = singleton({
  label: 'Sydney Holiday Camps',
  path: 'src/content/sydney-holiday-camps',
  format: { contentField: 'leadText' },
  schema: {
    title: fields.text({ label: 'Title' }),
    image: fields.image({
      label: 'Image',
      directory: 'public/images/sydney-holiday-camps',
      publicPath: '/images/sydney-holiday-camps/',
    }),
    leadText: fields.mdx({
      label: 'Lead Text',
      options: {
        image: {
          directory: 'public/images/sydney-holiday-camps',
          publicPath: '/images/sydney-holiday-camps/',
        },
      },
    }),
  },
})

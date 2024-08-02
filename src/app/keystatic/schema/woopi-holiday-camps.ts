import { singleton, fields } from '@keystatic/core'

export const woopiHolidayCamps = singleton({
  label: 'Woopi Holiday Camps',
  path: 'src/content/woopi-holiday-camps',
  format: { contentField: 'leadText' },
  schema: {
    title: fields.text({ label: 'Title' }),
    image: fields.image({
      label: 'Image',
      directory: 'public/images/woopi-holiday-camps',
      publicPath: '/images/woopi-holiday-camps/',
    }),
    leadText: fields.mdx({
      label: 'Lead Text',
      options: {
        image: {
          directory: 'public/images/woopi-holiday-camps',
          publicPath: '/images/woopi-holiday-camps/',
        },
      },
    }),
  },
})

import { singleton, fields } from '@keystatic/core'

export const sydneyHolidayCamps = singleton({
  label: 'Sydney Holiday Camps',
  path: 'src/content/sydney-holiday-camps',
  schema: {
    title: fields.text({ label: 'Title' }),
    document: fields.document({ label: 'Lead Text', formatting: true, links: true, images: true }),
  },
})

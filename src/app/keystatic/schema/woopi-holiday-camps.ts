import { singleton, fields } from '@keystatic/core'

export const woopiHolidayCamps = singleton({
  label: 'Woopi Holiday Camps',
  path: 'src/content/woopi-holiday-camps',
  schema: {
    title: fields.text({ label: 'Title' }),
    document: fields.document({ label: 'Lead Text', formatting: true, links: true, images: true }),
  },
})

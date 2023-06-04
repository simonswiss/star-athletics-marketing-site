import { singleton, fields } from '@keystatic/core'

export const woopiSchools = singleton({
  label: 'Woopi Schools',
  path: 'src/content/woopi-schools',
  schema: {
    title: fields.text({ label: 'Title' }),
    document: fields.document({ label: 'Lead Text', formatting: true, links: true, images: true }),
  },
})

import { singleton, fields } from '@keystatic/core'

export const woopiOneOnOne = singleton({
  label: 'Woopi One-on-one',
  path: 'src/content/woopi-one-on-one',
  schema: {
    title: fields.text({ label: 'Title' }),
    document: fields.document({ label: 'Lead Text', formatting: true, links: true, images: true }),
  },
})

import { singleton, fields } from '@keystatic/core'

export const sydneyOneOnOne = singleton({
  label: 'Sydney One-on-one',
  path: 'src/content/sydney-one-on-one',
  schema: {
    title: fields.text({ label: 'Title' }),
    document: fields.document({ label: 'Lead Text', formatting: true, links: true, images: true }),
  },
})

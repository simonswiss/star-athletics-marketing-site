import { singleton, fields } from '@keystatic/core'

export const coachesPage = singleton({
  label: 'Coaches Page',
  path: 'src/content/coaches-page',
  format: { contentField: 'introText' },
  schema: {
    title: fields.text({ label: 'Title' }),
    introText: fields.mdx({ label: 'Intro Text' }),
  },
})

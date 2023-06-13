import { singleton, fields } from '@keystatic/core'

export const coachesPage = singleton({
  label: 'Coaches Page',
  path: 'src/content/coaches-page',
  schema: {
    title: fields.text({ label: 'Title' }),
    introText: fields.document({ label: 'Intro Text', formatting: true, links: true }),
  },
})

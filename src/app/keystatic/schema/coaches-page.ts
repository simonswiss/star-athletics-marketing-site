import { singleton, fields } from '@keystatic/core'

export const coachesPage = singleton({
  label: 'Coaches Page',
  path: 'src/content/coaches-page',
  schema: {
    title: fields.text({ label: 'Title' }),
    introText: fields.text({ label: 'Intro Text', multiline: true }),
  },
})

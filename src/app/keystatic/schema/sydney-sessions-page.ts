import { singleton, fields } from '@keystatic/core'

export const sydneySessionsPage = singleton({
  label: 'Sydney Sessions Page',
  path: 'src/content/sydney-sessions-page',
  schema: {
    title: fields.text({ label: 'Title' }),
    leadText: fields.text({ label: 'Lead Text', multiline: true }),
  },
})

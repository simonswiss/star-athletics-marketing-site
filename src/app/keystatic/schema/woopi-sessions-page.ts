import { singleton, fields } from '@keystatic/core'

export const woopiSessionsPage = singleton({
  label: 'Woopi Sessions Page',
  path: 'src/content/woopi-sessions-page',
  schema: {
    title: fields.text({ label: 'Title' }),
    leadText: fields.text({ label: 'Lead Text', multiline: true }),
  },
})

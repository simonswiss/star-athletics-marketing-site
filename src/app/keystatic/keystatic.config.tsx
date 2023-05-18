import { config, collection } from '@keystatic/core'

import { storage } from './storage'
import { sessionSchema } from './schema/sessions'

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    sydneySessions: collection({
      label: 'Sydney Sessions',
      path: 'src/content/sessions/sydney/*',
      slugField: 'name',
      schema: sessionSchema,
    }),
    woopiSessions: collection({
      label: 'Woopi Sessions',
      path: 'src/content/sessions/woopi/*',
      slugField: 'name',
      schema: sessionSchema,
    }),
  },
})

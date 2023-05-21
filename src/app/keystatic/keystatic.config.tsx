import { config, collection } from '@keystatic/core'

import { storage } from './storage'
import { homepage } from './schema/homepage'
import { sessionSchema } from './schema/sessions'
import { coaches } from './schema/coaches'
import { testimonials } from './schema/testimonials'

export default config({
  storage,
  singletons: {
    homepage,
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
    coaches,
    testimonials,
  },
})

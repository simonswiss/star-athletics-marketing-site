import { config, collection } from '@keystatic/core'

import { storage } from './storage'
import { homepage } from './schema/homepage'
import { sydneyPage } from './schema/sydney-page'
import { woopiPage } from './schema/woopi-page'
import { coachesPage } from './schema/coaches-page'
import { sessionSchema } from './schema/sessions'
import { coaches } from './schema/coaches'
import { testimonials } from './schema/testimonials'

export default config({
  storage: {
    kind: 'local',
  },
  singletons: {
    homepage,
    sydneyPage,
    woopiPage,
    coachesPage,
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

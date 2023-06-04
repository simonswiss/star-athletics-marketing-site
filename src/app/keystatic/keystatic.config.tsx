import { config, collection, fields, component } from '@keystatic/core'

import { storage } from './storage'
import { homepage } from './schema/homepage'
import { sydneyPage } from './schema/sydney-page'
import { woopiPage } from './schema/woopi-page'
import { coachesPage } from './schema/coaches-page'
import { sessionSchema } from './schema/sessions'
import { coaches } from './schema/coaches'
import { testimonials } from './schema/testimonials'
import { faqs } from './schema/faqs'

export default config({
  storage,
  singletons: {
    homepage,
    sydneyPage,
    woopiPage,
    coachesPage,
    faqs,
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

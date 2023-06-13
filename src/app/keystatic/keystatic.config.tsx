import { config, collection, fields, component } from '@keystatic/core'

import { storage } from './storage'
import { homepage } from './schema/homepage'
import { sydneyPage } from './schema/sydney-page'
import { sydneySessionsPage } from './schema/sydney-sessions-page'
import { sydneyOneOnOne } from './schema/sydney-one-on-one'
import { sydneyHolidayCamps } from './schema/sydney-holiday-camps'
import { woopiPage } from './schema/woopi-page'
import { woopiSessionsPage } from './schema/woopi-sessions-page'
import { woopiOneOnOne } from './schema/woopi-one-on-one'
import { woopiHolidayCamps } from './schema/woopi-holiday-camps'
import { sydneyPopupClinics } from './schema/sydney-popup-clinics'
import { woopiSchools } from './schema/woopi-schools'
import { coachesPage } from './schema/coaches-page'
import { sessionSchema } from './schema/sessions'
import { coaches } from './schema/coaches'
import { testimonials } from './schema/testimonials'
import { faqs } from './schema/faqs'
import { nswEventsPage } from './schema/nsw-events-page'
import { nswEvents } from './schema/nsw-events'
import { contacts } from './schema/contacts'

export default config({
  storage,
  singletons: {
    homepage,
    coachesPage,
    faqs,
    sydneyPage,
    sydneySessionsPage,
    sydneyOneOnOne,
    sydneyHolidayCamps,
    sydneyPopupClinics,
    woopiPage,
    woopiSchools,
    woopiSessionsPage,
    woopiOneOnOne,
    woopiHolidayCamps,
    nswEventsPage,
    contacts,
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
    nswEvents,
  },
})

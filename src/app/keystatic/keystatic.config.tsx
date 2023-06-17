import { config, collection } from '@keystatic/core'

import { storage } from './storage'

import { homepage } from './schema/homepage'
import { coachesPage } from './schema/coaches-page'
import { nswEventsPage } from './schema/nsw-events-page'
import { registerPage } from './schema/register-page'
import { contacts } from './schema/contacts'

import { sydneyPage } from './schema/sydney-page'
import { sydneySessionsPage } from './schema/sydney-sessions-page'
import { sydneyOneOnOne } from './schema/sydney-one-on-one'
import { sydneyHolidayCamps } from './schema/sydney-holiday-camps'
import { sydneyPopupClinics } from './schema/sydney-popup-clinics'

import { woopiPage } from './schema/woopi-page'
import { woopiSessionsPage } from './schema/woopi-sessions-page'
import { woopiOneOnOne } from './schema/woopi-one-on-one'
import { woopiHolidayCamps } from './schema/woopi-holiday-camps'
import { woopiPopupClinics } from './schema/woopi-popup-clinics'
import { woopiSchools } from './schema/woopi-schools'

import { coaches } from './schema/coaches'
import { nswEvents } from './schema/nsw-events'
import { sessionSchema } from './schema/sessions'
import { testimonials } from './schema/testimonials'
import { faqs } from './schema/faqs'

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
    woopiPopupClinics,
    nswEventsPage,
    contacts,
    registerPage,
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

import { config, collection } from '@keystatic/core'
import React from 'react'

import { storage } from './storage'

import { homepage } from './schema/homepage'
import { coachesPage } from './schema/coaches-page'
import { registerPage } from './schema/register-page'
import { contacts } from './schema/contacts'

// Consolidated page schemas
import {
  sydneyPage,
  sydneySessionsPage,
  sydneyOneOnOne,
  sydneyHolidayCamps,
  sydneyPopupClinics,
  woopiPage,
  woopiSessionsPage,
  woopiOneOnOne,
  woopiHolidayCamps,
  woopiPopupClinics,
  woopiSchools,
  woopiTeamRelay,
  nswEventsPage,
  partnerships,
} from './schema/pages'

import { coaches } from './schema/coaches'
import { nswEvents } from './schema/nsw-events'
import { sessionSchema } from './schema/sessions'
import { testimonials } from './schema/testimonials'
import { faqs } from './schema/faqs'

export default config({
  storage,
  ui: {
    brand: {
      name: 'Star Athletics',
      mark: () =>
        (
          <svg xmlns="http://www.w3.org/2000/svg" width="34" height="24" fill="none">
            <path
              fill="currentColor"
              d="m25 13-2 1v-2l-2-2h3l1-2 1 2h2l-1 2v2l-2-1Zm7-4h-5l-2-5-2 5h-5l4 4-1 4 4-2 4 2-1-4 4-4Z"
            />
            <path
              fill="currentColor"
              d="m31 19-6-3-6 3 2-6-5-4 6-1-5-8L0 24 15 9l4 4-16 9 16-8-1 6-18 4h34l-3-5Z"
            />
          </svg>
        ) as any,
    },
    navigation: {
      Sydney: [
        'sydneySessions',
        'sydneyPage',
        'sydneySessionsPage',
        'sydneyOneOnOne',
        'sydneyHolidayCamps',
        'sydneyPopupClinics',
      ],
      Woopi: [
        'woopiSessions',
        'woopiPage',
        'woopiSchools',
        'woopiSessionsPage',
        'woopiOneOnOne',
        'woopiHolidayCamps',
        'woopiPopupClinics',
        'woopiTeamRelay',
      ],
      Collections: ['coaches', 'testimonials', 'nswEvents'],
      Pages: [
        'homepage',
        'coachesPage',
        'faqs',
        'nswEventsPage',
        'partnerships',
        'contacts',
        'registerPage',
      ],
    },
  },
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
    woopiTeamRelay,
    nswEventsPage,
    partnerships,
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

import { config, collection, fields, singleton } from '@keystatic/core'
import React from 'react'

import { storage } from './storage'

import { homepage } from './schema/homepage'
import { coachesPage } from './schema/coaches-page'
import { registerPage } from './schema/register-page'
import { contacts } from './schema/contacts'

import { sydneyPages, woopiPages, generalPages, dynamicPages } from './schema/dynamic-pages'
import { sydneyNavigation, woopiNavigation, headerNavigation } from './schema/navigation'
import { sydneyPage, sydneySessionsPage, woopiPage, woopiSessionsPage } from './schema/pages'

import { coaches } from './schema/coaches'
import { sessionSchema } from './schema/sessions'
import { testimonials } from './schema/testimonials'
import { faqs } from './schema/faqs'
import { partnershipsPage, partnerships } from './schema/partnerships'

export default config({
  storage,
  ui: {
    brand: {
      name: 'Star Athletics',
      mark: StarAthleticsLogo as any,
    },
    navigation: {
      Sydney: [
        'sydneyPage',
        'sydneySessionsPage',
        'sydneySessions',
        'sydneyPages',
        'sydneyNavigation',
      ],
      Woopi: ['woopiPage', 'woopiSessionsPage', 'woopiSessions', 'woopiPages', 'woopiNavigation'],
      'Cross-Region': ['generalPages'],
      Collections: ['coaches', 'testimonials', 'partnerships'],
      Pages: ['homepage', 'coachesPage', 'faqs', 'partnershipsPage', 'contacts', 'registerPage'],
      Navigation: ['headerNavigation'],
    },
  },
  singletons: {
    sydneyNavigation,
    woopiNavigation,
    headerNavigation,

    homepage,
    coachesPage,
    faqs,
    contacts,
    registerPage,

    sydneyPage,
    sydneySessionsPage,
    woopiPage,
    woopiSessionsPage,

    partnershipsPage,
  },
  collections: {
    sydneyPages,
    woopiPages,
    generalPages,
    dynamicPages,
    sydneySessions: collection({
      label: 'Sydney Sessions (Collection)',
      path: 'src/content/sessions/sydney/*',
      slugField: 'name',
      schema: sessionSchema,
    }),
    woopiSessions: collection({
      label: 'Woopi Sessions (Collection)',
      path: 'src/content/sessions/woopi/*',
      slugField: 'name',
      schema: sessionSchema,
    }),
    coaches,
    testimonials,
    partnerships,
  },
})

// ------------------------------
// Logo Mark
// ------------------------------
function StarAthleticsLogo() {
  return (
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
  )
}

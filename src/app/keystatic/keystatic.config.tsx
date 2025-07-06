import { config, collection, fields, singleton } from '@keystatic/core'
import React from 'react'

import { storage } from './storage'

import { homepage } from './schema/homepage'
import { coachesPage } from './schema/coaches-page'
import { registerPage } from './schema/register-page'
import { contacts } from './schema/contacts'

// Dynamic pages and navigation
import { sydneyPages, woopiPages, generalPages, dynamicPages } from './schema/dynamic-pages'
import { sydneyNavigation, woopiNavigation, headerNavigation } from './schema/navigation'

// Remaining page schemas
import { sydneyPage, sydneySessionsPage, woopiPage, woopiSessionsPage } from './schema/pages'

import { coaches } from './schema/coaches'
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
    // New navigation system
    sydneyNavigation,
    woopiNavigation,
    headerNavigation,

    // Core site pages
    homepage,
    coachesPage,
    faqs,
    contacts,
    registerPage,

    // Region landing pages
    sydneyPage,
    sydneySessionsPage,
    woopiPage,
    woopiSessionsPage,

    partnershipsPage: singleton({
      label: 'Partnerships Page',
      path: 'src/content/partnerships-page',
      schema: {
        title: fields.text({ label: 'Title' }),
        introText: fields.document({ label: 'Intro Text', formatting: true, links: true }),
        partnerships: fields.array(
          fields.relationship({
            label: 'Partnership',
            collection: 'partnerships',
            validation: { isRequired: true },
          }),
          {
            label: 'Partnerships',
            itemLabel: (data) => data?.value || 'Partnership',
          }
        ),
      },
    }),
  },
  collections: {
    // Region-specific pages
    sydneyPages,
    woopiPages,
    generalPages,

    // Legacy pages system
    dynamicPages,

    // Session collections
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

    // Other collections
    coaches,
    testimonials,
    partnerships: collection({
      label: 'Partnerships',
      path: 'src/content/partnerships/*',
      slugField: 'name',
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        introText: fields.document({ label: 'Intro Text', formatting: true, links: true }),
        logo: fields.image({
          label: 'Logo',
          directory: 'public/images/partnerships',
          publicPath: '/images/partnerships/',
        }),
        website: fields.url({ label: 'Website' }),
        perks: fields.array(fields.text({ label: 'Perk' }), {
          label: 'Perks',
          itemLabel: (data) => data.value,
        }),
      },
    }),
  },
})

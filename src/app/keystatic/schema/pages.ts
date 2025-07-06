import {
  createSimplePageSchema,
  createLandingPageSchema,
  createSessionsPageSchema,
} from './page-schemas'

// Landing Pages
export const sydneyPage = createLandingPageSchema({
  label: 'Sydney Landing Page',
  path: 'src/content/sydney-page',
  imageDirectory: 'sydney-page',
  imagesDescription: '4 (required) images to be displayed in the Sydney landing page',
})

export const woopiPage = createLandingPageSchema({
  label: 'Woopi Landing Page',
  path: 'src/content/woopi-page',
  imageDirectory: 'woopi-page',
  imagesDescription: '4 (required) images to be displayed in the Woopi landing page',
})

// Sessions Pages
export const sydneySessionsPage = createSessionsPageSchema({
  label: 'Sydney Sessions Page',
  path: 'src/content/sydney-sessions-page',
  imageDirectory: 'sydney-sessions-page',
})

export const woopiSessionsPage = createSessionsPageSchema({
  label: 'Woopi Sessions Page',
  path: 'src/content/woopi-sessions-page',
  imageDirectory: 'woopi-sessions-page',
})

// Simple Pages (no booking)
export const sydneyPopupClinics = createSimplePageSchema({
  label: 'Sydney Popup Clinics',
  path: 'src/content/sydney-popup-clinics',
  imageDirectory: 'sydney-popup-clinics',
})

export const woopiPopupClinics = createSimplePageSchema({
  label: 'Woopi Popup Clinics',
  path: 'src/content/woopi-popup-clinics',
  imageDirectory: 'woopi-popup-clinics',
})

export const woopiHolidayCamps = createSimplePageSchema({
  label: 'Woopi Holiday Camps',
  path: 'src/content/woopi-holiday-camps',
  imageDirectory: 'woopi-holiday-camps',
})

export const sydneyOneOnOne = createSimplePageSchema({
  label: 'Sydney One-on-one',
  path: 'src/content/sydney-one-on-one',
  imageDirectory: 'sydney-one-on-one',
})

export const nswEventsPage = createSimplePageSchema({
  label: 'NSW Events Page',
  path: 'src/content/nsw-events',
  imageDirectory: 'nsw-events',
})

export const partnerships = createSimplePageSchema({
  label: 'Partnerships',
  path: 'src/content/partnerships',
  imageDirectory: 'partnerships',
})

export const woopiSchools = createSimplePageSchema({
  label: 'Woopi Schools',
  path: 'src/content/woopi-schools',
  imageDirectory: 'woopi-schools',
})

// Simple Pages (with booking)
export const sydneyHolidayCamps = createSimplePageSchema({
  label: 'Sydney Holiday Camps',
  path: 'src/content/sydney-holiday-camps',
  imageDirectory: 'sydney-holiday-camps',
  includeBooking: true,
})

export const woopiOneOnOne = createSimplePageSchema({
  label: 'Woopi One-on-one',
  path: 'src/content/woopi-one-on-one',
  imageDirectory: 'woopi-one-on-one',
  includeBooking: true,
})

export const woopiTeamRelay = createSimplePageSchema({
  label: 'Woopi Team Relay Training',
  path: 'src/content/woopi-team-relay',
  imageDirectory: 'woopi-team-relay',
  includeBooking: true,
})

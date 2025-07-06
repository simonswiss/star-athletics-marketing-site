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

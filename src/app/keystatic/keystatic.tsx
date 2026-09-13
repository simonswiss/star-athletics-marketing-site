'use client'
import { makePage } from '@keystatic/next/ui/app'
import config from './keystatic.config'
import { PublishingShell } from './publishing-panel'

// Keep the publishing UI out of the shared config used by public page readers.
export default makePage({
  ...config,
  ui: {
    ...config.ui,
    draftPublishing:
      config.storage.kind === 'github' ? PublishingShell : undefined,
  },
})

import { singleton, fields } from '@keystatic/core'
import { calComBooking } from '../fields/cal-com-booking'

interface PageSchemaOptions {
  label: string
  path: string
  imageDirectory: string
  includeBooking?: boolean
}

interface LandingPageSchemaOptions extends PageSchemaOptions {
  imagesDescription: string
}

/**
 * Creates a simple page schema with title, image, and document fields
 * Optionally includes booking functionality
 */
export function createSimplePageSchema(options: PageSchemaOptions) {
  const baseSchema = {
    title: fields.text({ label: 'Title' }),
    image: fields.image({
      label: 'Image',
      directory: `public/images/${options.imageDirectory}`,
      publicPath: `/images/${options.imageDirectory}/`,
    }),
    document: fields.document({
      label: 'Lead Text',
      formatting: true,
      links: true,
      images: {
        directory: `public/images/${options.imageDirectory}`,
        publicPath: `/images/${options.imageDirectory}/`,
      },
    }),
  }

  // Add booking field if requested
  const schema = options.includeBooking ? { ...baseSchema, calComBooking } : baseSchema

  return singleton({
    label: options.label,
    path: options.path,
    schema,
  })
}

/**
 * Creates a landing page schema with title, leadText, introText, buttonText, and images array
 */
export function createLandingPageSchema(options: LandingPageSchemaOptions) {
  return singleton({
    label: options.label,
    path: options.path,
    schema: {
      title: fields.text({ label: 'Title' }),
      leadText: fields.text({ label: 'Lead Text', multiline: true }),
      introText: fields.document({ label: 'Intro Text', formatting: true, links: true }),
      buttonText: fields.text({ label: 'Button Text' }),
      images: fields.array(
        fields.object({
          url: fields.image({
            label: 'Image',
            directory: `public/images/${options.imageDirectory}`,
            publicPath: `/images/${options.imageDirectory}/`,
            validation: { isRequired: true },
          }),
          altText: fields.text({ label: 'Alt Text' }),
        }),
        {
          label: 'Images',
          description: options.imagesDescription,
          itemLabel: (props) =>
            props.fields.altText.value || "No alt text for this image (it's important for SEO!)",
          validation: { length: { min: 4, max: 4 } },
        }
      ),
    },
  })
}

/**
 * Creates a sessions page schema with title, leadText (document), and image
 */
export function createSessionsPageSchema(options: PageSchemaOptions) {
  return singleton({
    label: options.label,
    path: options.path,
    schema: {
      title: fields.text({ label: 'Title' }),
      leadText: fields.document({ label: 'Lead Text', formatting: true, links: true }),
      image: fields.image({
        label: 'Image',
        directory: `public/images/${options.imageDirectory}`,
        publicPath: `/images/${options.imageDirectory}/`,
      }),
    },
  })
}

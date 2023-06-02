import { config, collection, fields, component } from '@keystatic/core'

import { storage } from './storage'
import { homepage } from './schema/homepage'
import { sydneyPage } from './schema/sydney-page'
import { woopiPage } from './schema/woopi-page'
import { coachesPage } from './schema/coaches-page'
import { sessionSchema } from './schema/sessions'
import { coaches } from './schema/coaches'
import { testimonials } from './schema/testimonials'

export default config({
  storage,
  singletons: {
    homepage,
    sydneyPage,
    woopiPage,
    coachesPage,
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
    test: collection({
      label: 'Test',
      path: 'src/content/test/*',
      slugField: 'name',
      schema: {
        name: fields.slug({
          name: {
            label: 'Name',
          },
        }),
        document: fields.document({
          label: 'Document',
          formatting: true,
          links: true,
          componentBlocks: {
            quote: component({
              preview: () => null,
              label: 'Quote',
              schema: {
                content: fields.child({
                  kind: 'block',
                  placeholder: 'Quote...',
                  formatting: { inlineMarks: 'inherit', softBreaks: 'inherit' },
                  links: 'inherit',
                }),
                attribution: fields.child({ kind: 'inline', placeholder: 'Attribution...' }),
              },
            }),
          },
        }),
        videoFile: fields.pathReference({
          label: 'Video file',
          description: 'A reference to a video file in the `public` folder',
          pattern: 'public/**/*',
        }),
        complexArray: fields.array(
          fields.object({
            name: fields.text({ label: 'Name' }),
            age: fields.integer({ label: 'Age' }),
            projects: fields.array(
              fields.relationship({
                label: 'Projects',
                collection: 'coaches',
                validation: {
                  isRequired: true,
                },
              }),
              {
                label: 'Projects',
                itemLabel: (props) => props.value ?? 'Please select a project',
              }
            ),
          }),
          {
            label: 'Complex Array',
            itemLabel: (props) => props.fields.name.value,
          }
        ),
        select: fields.select({
          label: 'Multi',
          options: [
            { label: 'A', value: 'a' },
            { label: 'B', value: 'b' },
            { label: 'C', value: 'c' },
          ],
          defaultValue: 'a',
        }),
        date: fields.date({
          label: 'Date',
        }),
        snapshot: fields.object({
          name: fields.text({ label: 'Name' }),
          age: fields.integer({ label: 'Age' }),
          projects: fields.array(
            fields.relationship({
              label: 'Projects',
              collection: 'projects',
              validation: {
                isRequired: true,
              },
            }),
            {
              label: 'Projects',
              itemLabel: (props) => props.value ?? 'Please select a project',
            }
          ),
        }),
        multi: fields.multiselect({
          label: 'Interests',
          options: [
            { label: 'Surfing', value: 'surfing' },
            { label: 'Basketball', value: 'basketball' },
            { label: 'Music', value: 'music' },
            { label: 'Chess', value: 'chess' },
          ],
          defaultValue: ['surfing', 'basketball', 'music'],
        }),
      },
    }),
  },
})

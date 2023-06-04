import { singleton, fields } from '@keystatic/core'

export const faqs = singleton({
  label: 'Frequently Asked Questions',
  path: 'src/content/faqs',
  schema: {
    questions: fields.array(
      fields.object({
        question: fields.text({ label: 'Question' }),
        answer: fields.document({ label: 'Answer', formatting: true, links: true }),
      }),
      {
        label: 'Question',
        itemLabel: (props) => props.fields.question.value,
      }
    ),
  },
})

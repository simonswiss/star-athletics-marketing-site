import assert from 'node:assert/strict'
import test from 'node:test'
import { parsePatch, replacementRange, diffExcerpt } from '../src/lib/publishing/diff'

test('scalar copy changes have a readable field name and exact before/after text', () => {
  assert.deepEqual(
    parsePatch(
      "@@ -1,2 +1,2 @@\n title: Page\n-leadText: 'Sporting success. '\n+leadText: Sporting success!",
      1,
      1,
    ),
    {
      changes: [
        {
          field: 'Lead text',
          before: 'Sporting success. ',
          after: 'Sporting success!',
        },
      ],
      incomplete: false,
    },
  )
})

test('separate changes stay separate and hunk markers never appear as copy', () => {
  assert.deepEqual(
    parsePatch(
      '@@ -1,3 +1,3 @@\n-old\n+new\n context\n-before\n+after\n@@ -20 +20 @@\n-x\n+y',
    ),
    {
      changes: [
        { before: 'old', after: 'new' },
        { before: 'before', after: 'after' },
        { before: 'x', after: 'y' },
      ],
      incomplete: false,
    },
  )
})

test('additions, removals and incomplete GitHub patches are identified', () => {
  assert.deepEqual(parsePatch('@@ -0,0 +1 @@\n+New entry\n').changes, [
    { before: '', after: 'New entry' },
  ])
  assert.deepEqual(parsePatch('@@ -1 +0,0 @@\n-Removed entry').changes, [
    { before: 'Removed entry', after: '' },
  ])
  assert.equal(parsePatch('@@ -1,2 +1,2 @@\n-before\n+after').incomplete, true)
  assert.equal(
    parsePatch('@@ -1 +1 @@\n-before\n+after', 2, 1).incomplete,
    true,
  )
  assert.equal(parsePatch('not a patch').incomplete, true)
})

test('field values preserve YAML escaping and empty values', () => {
  assert.deepEqual(
    parsePatch(`@@ -1 +1 @@\n-title: 'It''s ready'\n+title: ''`).changes,
    [{ field: 'Title', before: "It's ready", after: '' }],
  )
  assert.deepEqual(
    parsePatch('@@ -1 +1 @@\n-title: "Old"\n+title: "New"').changes,
    [{ field: 'Title', before: 'Old', after: 'New' }],
  )
})

test('punctuation and emoji highlights do not split Unicode characters', () => {
  assert.deepEqual(replacementRange('Success.', 'Success!'), {
    start: 7,
    beforeEnd: 8,
    afterEnd: 8,
  })
  assert.deepEqual(replacementRange('Run 😀 now', 'Run 😃 now'), {
    start: 4,
    beforeEnd: 6,
    afterEnd: 6,
  })
})


test('compact punctuation diffs omit distant context and expand without losing text', () => {
  const paragraph = 'An introductory sentence that is far from the edit. Young athletes push their limits, celebrate progress, and succeed together'
  const compact = diffExcerpt(paragraph + '.', paragraph + '!')
  assert.equal(compact.removed, '.')
  assert.equal(compact.added, '!')
  assert.equal(compact.collapsed, true)
  assert.equal(compact.incomplete, false)
  assert.ok(compact.prefix.startsWith('…'))
  assert.ok(compact.prefix.length <= 41)
  const full = diffExcerpt(paragraph + '.', paragraph + '!', true)
  assert.equal(full.prefix + full.removed + full.suffix, paragraph + '.')
  assert.equal(full.prefix + full.added + full.suffix, paragraph + '!')
  assert.equal(full.collapsed, false)
})

test('compact diffs preserve changed emoji, additions and deletions and label oversized changes', () => {
  const start = '😀'.repeat(60)
  const end = '😃'.repeat(60)
  const edit = diffExcerpt(start + 'old' + end, start + 'new' + end)
  assert.equal(edit.prefix, '…' + '😀'.repeat(40))
  assert.equal(edit.suffix, '😃'.repeat(40) + '…')
  assert.equal(edit.removed, 'old')
  assert.equal(edit.added, 'new')
  assert.equal(diffExcerpt('', 'New line').added, 'New line')
  assert.equal(diffExcerpt('Removed line', '').removed, 'Removed line')
  assert.equal(diffExcerpt('x'.repeat(2500), 'y'.repeat(2500)).incomplete, true)
})

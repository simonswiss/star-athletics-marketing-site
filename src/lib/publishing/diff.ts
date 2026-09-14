export type TextChange = { before: string; after: string; field?: string }

/** Extract changed blocks without exposing Git hunk markers in the editor. */
export function parsePatch(
  patch: string,
  additions?: number,
  deletions?: number,
) {
  const changes: TextChange[] = []
  let before: string[] = [],
    after: string[] = []
  let expectedOld = 0,
    expectedNew = 0,
    oldLines = 0,
    newLines = 0
  let added = 0,
    removed = 0,
    hasHunk = false,
    incomplete = false
  const flush = () => {
    if (before.length || after.length)
      changes.push(readableChange(before.join('\n'), after.join('\n')))
    before = []
    after = []
  }
  const finishHunk = () => {
    flush()
    if (hasHunk && (expectedOld !== oldLines || expectedNew !== newLines))
      incomplete = true
  }
  const lines = patch.split('\n')
  // A final newline terminates the patch; it is not an unprefixed diff line.
  if (lines.at(-1) === '') lines.pop()
  for (const line of lines) {
    const hunk = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/.exec(line)
    if (hunk) {
      finishHunk()
      hasHunk = true
      expectedOld = Number(hunk[2] ?? 1)
      expectedNew = Number(hunk[4] ?? 1)
      oldLines = 0
      newLines = 0
    } else if (!hasHunk) {
      incomplete = true
    } else if (line.startsWith('-')) {
      before.push(line.slice(1))
      oldLines++
      removed++
    } else if (line.startsWith('+')) {
      after.push(line.slice(1))
      newLines++
      added++
    } else if (line.startsWith(' ')) {
      flush()
      oldLines++
      newLines++
    } else if (!line.startsWith('\\ No newline at end of file')) {
      incomplete = true
    }
  }
  finishHunk()
  if (additions !== undefined && added !== additions) incomplete = true
  if (deletions !== undefined && removed !== deletions) incomplete = true
  return { changes, incomplete: incomplete || !hasHunk }
}

function readableChange(before: string, after: string): TextChange {
  const oldField = /^([a-zA-Z]\w*): ([^\n]*)$/.exec(before)
  const newField = /^([a-zA-Z]\w*): ([^\n]*)$/.exec(after)
  if (
    oldField &&
    newField &&
    oldField[1] === newField[1] &&
    !/^[>|]/.test(oldField[2]) &&
    !/^[>|]/.test(newField[2])
  ) {
    const field = oldField[1]
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/_/g, ' ')
    return {
      field: field[0].toUpperCase() + field.slice(1).toLowerCase(),
      before: unquote(oldField[2]),
      after: unquote(newField[2]),
    }
  }
  return { before, after }
}

function unquote(value: string) {
  if (value.startsWith("'") && value.endsWith("'"))
    return value.slice(1, -1).replace(/''/g, "'")
  if (value.startsWith('"') && value.endsWith('"')) {
    try {
      return JSON.parse(value) as string
    } catch {
      /* Keep unfamiliar YAML escapes verbatim. */
    }
  }
  return value
}

/** Highlight the replacement while retaining the surrounding sentence. */
export function replacementRange(before: string, after: string) {
  const oldCharacters = Array.from(before),
    newCharacters = Array.from(after)
  let start = 0
  while (
    start < oldCharacters.length &&
    start < newCharacters.length &&
    oldCharacters[start] === newCharacters[start]
  )
    start++
  let end = 0
  while (
    end < oldCharacters.length - start &&
    end < newCharacters.length - start &&
    oldCharacters[oldCharacters.length - 1 - end] ===
      newCharacters[newCharacters.length - 1 - end]
  )
    end++
  return {
    start: oldCharacters.slice(0, start).join('').length,
    beforeEnd: oldCharacters.slice(0, oldCharacters.length - end).join('')
      .length,
    afterEnd: newCharacters.slice(0, newCharacters.length - end).join('')
      .length,
  }
}

/** Keep every changed character; collapse only distant, unchanged context. */
export function diffExcerpt(before: string, after: string, expanded = false) {
  const range = replacementRange(before, after)
  const context = expanded ? 2000 : 40
  const prefix = Array.from(before.slice(0, range.start))
  const suffix = Array.from(before.slice(range.beforeEnd))
  const hiddenStart = prefix.length > context
  const hiddenEnd = suffix.length > context
  const lead = (hiddenStart ? '…' : '') + prefix.slice(-context).join('')
  const tail = suffix.slice(0, context).join('') + (hiddenEnd ? '…' : '')
  const removed = Array.from(before.slice(range.start, range.beforeEnd))
  const added = Array.from(after.slice(range.start, range.afterEnd))
  return {
    prefix: lead,
    suffix: tail,
    removed:
      removed.slice(0, 2000).join('') + (removed.length > 2000 ? '…' : ''),
    added: added.slice(0, 2000).join('') + (added.length > 2000 ? '…' : ''),
    collapsed: hiddenStart || hiddenEnd,
    incomplete:
      removed.length > 2000 ||
      added.length > 2000 ||
      (expanded && (hiddenStart || hiddenEnd)),
  }
}

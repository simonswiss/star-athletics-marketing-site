'use client'

import { Flex } from '@keystar/ui/layout'
import { Text } from '@keystar/ui/typography'
import { parsePatch, replacementRange } from '@/lib/publishing/diff'
import type { ChangedFile } from '@/lib/publishing/github'

export function ChangePreview({ file }: { file: ChangedFile }) {
  if (!file.patch) {
    const image = /\.(avif|gif|jpe?g|png|svg|webp)$/i.test(file.filename)
    return (
      <Text color="neutralSecondary" size="small">
        {image
          ? `Image ${file.status === 'added' ? 'added' : file.status === 'removed' ? 'removed' : 'changed'}. No text preview is available.`
          : file.status === 'renamed'
            ? 'File renamed. See the full comparison for details.'
            : 'A text preview is unavailable. See the full comparison for details.'}
      </Text>
    )
  }
  const { changes, incomplete } = parsePatch(
    file.patch,
    file.additions,
    file.deletions,
  )
  // Keep large batches usable; the full immutable comparison remains linked.
  const visible = changes.slice(0, 4)
  const shortened =
    changes.length > visible.length ||
    visible.some(
      (change) => change.before.length > 2000 || change.after.length > 2000,
    )
  return (
    <Flex direction="column" gap="large">
      {visible.map((change, index) => {
        if (change.before === change.after)
          return (
            <Text key={index} size="small" color="neutralSecondary">
              Formatting changed; the text is unchanged.
            </Text>
          )
        const range = replacementRange(change.before, change.after)
        return (
          <Flex direction="column" gap="medium" key={index}>
            {change.field && (
              <Text size="small" weight="medium">
                {change.field}
              </Text>
            )}
            {(['before', 'after'] as const).map((side) => {
              const value = change[side]
              if (!value && !change.field) return null
              const end = side === 'before' ? range.beforeEnd : range.afterEnd
              const limit = 2000
              return (
                <Flex direction="column" gap="small" key={side}>
                  <Text
                    size="small"
                    color={side === 'before' ? 'critical' : 'positive'}
                    weight="medium"
                  >
                    {side === 'before' ? 'Before' : 'After'}
                  </Text>
                  <Text
                    elementType="p"
                    UNSAFE_style={{
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {!value && 'Empty'}
                    {value.slice(0, Math.min(range.start, limit))}
                    <Text
                      elementType={side === 'before' ? 'del' : 'ins'}
                      color={side === 'before' ? 'critical' : 'positive'}
                      weight="medium"
                    >
                      {value.slice(range.start, Math.min(end, limit))}
                    </Text>
                    {value.slice(end, limit)}
                    {value.length > limit ? '…' : ''}
                  </Text>
                </Flex>
              )
            })}
          </Flex>
        )
      })}
      {(incomplete || shortened || !changes.length) && (
        <Text color="neutralSecondary" size="small">
          This preview is incomplete. Open the full comparison to review all
          changes.
        </Text>
      )}
    </Flex>
  )
}

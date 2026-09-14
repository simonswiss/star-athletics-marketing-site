'use client'

import { useState } from 'react'
import { Button } from '@keystar/ui/button'
import { Flex } from '@keystar/ui/layout'
import { Text } from '@keystar/ui/typography'
import { parsePatch, diffExcerpt } from '@/lib/publishing/diff'
import type { ChangedFile } from '@/lib/publishing/github'

export function ChangePreview({ file }: { file: ChangedFile }) {
  const [expanded, setExpanded] = useState(false)
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
  const visible = changes.slice(0, 4)
  const excerpts = visible.map((change) =>
    diffExcerpt(change.before, change.after, expanded),
  )
  const canExpand = visible.some(
    (change) => diffExcerpt(change.before, change.after).collapsed,
  )
  const shortened =
    changes.length > visible.length ||
    excerpts.some((excerpt) => excerpt.incomplete)
  return (
    <Flex direction="column" gap="medium">
      {visible.map((change, index) => {
        if (change.before === change.after)
          return (
            <Text key={index} size="small" color="neutralSecondary">
              Formatting changed; the text is unchanged.
            </Text>
          )
        const excerpt = excerpts[index]
        return (
          <Flex direction="column" gap="small" key={index}>
            {change.field && (
              <Text size="small" weight="medium">
                {change.field}
              </Text>
            )}
            <Flex direction="column">
              {(['before', 'after'] as const).map((side) => {
                if (!change[side] && !change.field) return null
                const removed = side === 'before'
                const tone = removed ? 'critical' : 'positive'
                return (
                  <Flex
                    key={side}
                    role="group"
                    aria-label={removed ? 'Removed text' : 'Added text'}
                    backgroundColor={tone}
                    paddingX="medium"
                    paddingY="small"
                    gap="medium"
                    alignItems="baseline"
                  >
                    <Text aria-hidden="true" color={tone} size="small" trim={false}>
                      {removed ? '−' : '+'}
                    </Text>
                    <Text
                      elementType="code"
                      size="small"
                      trim={false}
                      UNSAFE_style={{
                        fontFamily: 'var(--kui-typography-font-family-code)',
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'anywhere',
                        minWidth: 0,
                      }}
                    >
                      {excerpt.prefix}
                      <Text
                        elementType={removed ? 'del' : 'ins'}
                        color="onEmphasis"
                        weight="medium"
                        UNSAFE_style={{
                          backgroundColor: `var(--kui-color-background-${tone}-emphasis)`,
                          textDecoration: 'none',
                          fontFamily: 'inherit',
                        }}
                      >
                        {removed ? excerpt.removed : excerpt.added}
                      </Text>
                      {excerpt.suffix}
                      {!change[side] && '(empty)'}
                    </Text>
                  </Flex>
                )
              })}
            </Flex>
          </Flex>
        )
      })}
      {canExpand && (
        <Flex>
          <Button
            prominence="low"
            onPress={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
          >
            {expanded ? 'Collapse unchanged text' : 'Show full lines'}
          </Button>
        </Flex>
      )}
      {(incomplete || shortened || !changes.length) && (
        <Text color="neutralSecondary" size="small">
          This preview is incomplete. Open the full comparison to review all
          changes.
        </Text>
      )}
    </Flex>
  )
}

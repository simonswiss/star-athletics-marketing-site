'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { Button, ButtonGroup } from '@keystar/ui/button'
import { Dialog, DialogContainer } from '@keystar/ui/dialog'
import { Box, Flex } from '@keystar/ui/layout'
import { Content } from '@keystar/ui/slots'
import { Heading, Text } from '@keystar/ui/typography'
import { Notice } from '@keystar/ui/notice'
import { TextLink } from '@keystar/ui/link'
import { ChangePreview } from './change-preview'
import { toastQueue } from '@keystar/ui/toast'
import type { PublishingStatus } from '@/lib/publishing/github'

type PublishingProps = {
  children: ReactNode
  revision: string
  repositoryReady: boolean
  labels: Record<string, string>
}

export async function publishingRequest(body?: object) {
  const send = () =>
    fetch(
      '/api/publishing',
      body
        ? {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          }
        : { cache: 'no-store' },
    )
  let response = await send()
  if (response.status === 401) {
    const refresh = await fetch('/api/keystatic/github/refresh-token', {
      method: 'POST',
    })
    if (refresh.ok) response = await send()
  }
  const result = await response.json()
  if (!response.ok)
    throw Object.assign(new Error(result.error ?? 'Please try again.'), {
      status: response.status,
    })
  return result
}

// Navigation can remount the editor. Keep background reads shared for the current
// saved revision; a new native GitHub commit always invalidates this cache.
let cached:
  | { revision: string; status: PublishingStatus; at: number }
  | undefined
let pending:
  | { revision: string; promise: Promise<PublishingStatus> }
  | undefined
let preparing: Promise<unknown> | undefined
function readStatus(
  revision: string,
  force = false,
): Promise<PublishingStatus> {
  if (pending?.revision === revision) {
    // A review or post-publish read must run after an older background request.
    return force
      ? pending.promise
          .catch(() => undefined)
          .then(() => readStatus(revision, true))
      : pending.promise
  }
  if (
    !force &&
    cached?.revision === revision &&
    Date.now() - cached.at < 30_000
  )
    return Promise.resolve(cached.status)
  const promise = publishingRequest()
    .then((status: PublishingStatus) => {
      cached = { revision, status, at: Date.now() }
      return status
    })
    .finally(() => {
      if (pending?.promise === promise) pending = undefined
    })
  pending = { revision, promise }
  return promise
}

function changeLabel(filename: string, labels: Record<string, string>) {
  const entryPath = filename.replace(/\.(mdx?|ya?ml|json)$/, '')
  return (
    labels[entryPath] ??
    filename
      .replace(/^src\/content\//, '')
      .replace(/^public\/images\//, 'Images / ')
      .replace(/(?:-[a-f0-9]{12})?\.[^.]+$/, '')
      .split('/')
      .map((part) =>
        part
          .replace(/[-_]/g, ' ')
          .replace(/^./, (letter) => letter.toUpperCase()),
      )
      .join(' / ')
  )
}

export function PublishingShell({
  children,
  revision,
  repositoryReady,
  labels,
}: PublishingProps) {
  const [status, setStatus] = useState<PublishingStatus | null>(() =>
    cached?.revision === revision ? cached.status : null,
  )
  const [dirty, setDirty] = useState(false)
  const [review, setReview] = useState<PublishingStatus | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const onDirty = (event: Event) =>
      setDirty(Boolean((event as CustomEvent<boolean>).detail))
    window.addEventListener('keystatic:dirty', onDirty)
    return () => window.removeEventListener('keystatic:dirty', onDirty)
  }, [])

  useEffect(() => {
    if (!repositoryReady) return
    let active = true
    if (!revision) {
      // Only first-time setup needs to create a branch. Existing drafts open
      // immediately, without a prepare/merge request on every navigation.
      preparing ??= publishingRequest({ action: 'prepare' }).finally(() => {
        preparing = undefined
      })
      preparing
        .then(() => {
          if (active) window.location.reload()
        })
        .catch((error) => {
          if (active) setError(error.message)
        })
      return () => {
        active = false
      }
    }
    const refresh = (force = false) =>
      readStatus(revision, force)
        .then((value) => {
          if (active) {
            setStatus(value)
            setError('')
          }
        })
        .catch((error) => {
          if (active) setError(error.message)
        })
    void refresh()
    const onFocus = () => {
      void refresh(true)
    }
    const onVisible = () => {
      if (document.visibilityState === 'visible') onFocus()
    }
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisible)
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') void refresh(true)
    }, 30_000)
    return () => {
      active = false
      clearInterval(timer)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [revision, repositoryReady, attempt])

  const openReview = useCallback(async () => {
    if (dirty || busy) return
    setBusy(true)
    setError('')
    try {
      const latest = await readStatus(revision, true)
      setStatus(latest)
      if (latest.files.length) setReview(latest)
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setBusy(false)
    }
  }, [dirty, busy, revision])

  async function publish() {
    if (!review || dirty || busy) return
    setBusy(true)
    setError('')
    try {
      await publishingRequest({
        action: 'publish',
        draftSha: review.draftSha,
        publishedSha: review.publishedSha,
      })
      setReview(null)
      setStatus(null)
      cached = undefined
      toastQueue.positive(
        'Changes published. The site will update when the deployment finishes.',
      )
      // A failed status refresh must not leave a successfully published batch
      // open in the dialog. Concurrent saves are picked up by this fresh read.
      const latest = await readStatus(revision, true)
      setStatus(latest)
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const count = status?.files.length ?? 0
  return (
    <Flex direction="column" height="100vh">
      {count > 0 && (
        <Flex
          alignItems="center"
          justifyContent="space-between"
          wrap
          gap="medium"
          padding="medium"
          borderBottom="muted"
          backgroundColor="surface"
        >
          <Text role="status">
            {dirty
              ? 'Save your current edits before publishing.'
              : `${count} saved ${count === 1 ? 'change' : 'changes'} ready to publish`}
          </Text>
          <Button
            prominence="high"
            isDisabled={dirty || busy}
            onPress={openReview}
          >
            {busy && !review ? 'Checking changes…' : 'Review & publish'}
          </Button>
        </Flex>
      )}
      {error && !review && (
        <Box padding="medium">
          <Notice tone="critical">
            <Text>{error}</Text>
            <Button onPress={() => setAttempt((value) => value + 1)}>
              Try again
            </Button>
          </Notice>
        </Box>
      )}
      {!revision && repositoryReady ? (
        <Box padding="large">
          <Text>Preparing your first draft…</Text>
        </Box>
      ) : (
        children
      )}
      <DialogContainer
        onDismiss={() => {
          if (!busy) {
            setReview(null)
            setError('')
          }
        }}
        isKeyboardDismissDisabled={busy}
      >
        {review && (
          <Dialog size="large">
            <Heading>Publish saved changes</Heading>
            <Content>
              <Flex direction="column" gap="large">
                <Text>
                  This publishes all saved changes from the team. The site
                  updates after the deployment finishes.
                </Text>
                <Flex
                  elementType="ul"
                  direction="column"
                  gap="xlarge"
                  aria-label="Saved changes"
                >
                  {review.files.map((file) => (
                    <Flex
                      elementType="li"
                      direction="column"
                      gap="large"
                      key={file.filename}
                    >
                      <Text weight="medium">
                        {changeLabel(file.filename, labels)}
                      </Text>
                      <ChangePreview file={file} />
                    </Flex>
                  ))}
                </Flex>
                {review.comparisonUrl && (
                  <TextLink
                    href={review.comparisonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open full comparison on GitHub
                  </TextLink>
                )}
                {error && (
                  <Notice tone="critical">
                    <Text>{error}</Text>
                  </Notice>
                )}
              </Flex>
            </Content>
            <ButtonGroup>
              <Button
                isDisabled={busy}
                onPress={() => {
                  setReview(null)
                  setError('')
                }}
              >
                Keep editing
              </Button>
              <Button
                prominence="high"
                isDisabled={busy || dirty}
                onPress={publish}
              >
                {busy ? 'Publishing…' : 'Publish changes'}
              </Button>
            </ButtonGroup>
          </Dialog>
        )}
      </DialogContainer>
    </Flex>
  )
}

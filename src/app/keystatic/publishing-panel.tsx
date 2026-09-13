'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { PublishingStatus } from '@/lib/publishing/github'
import styles from './publishing.module.css'

function changeLabel(filename: string) {
  return filename
    .replace(/^src\/content\//, '')
    .replace(/^public\/images\//, 'images/')
    .replace(/(?:-[a-f0-9]{12})?\.[^.]+$/, '')
    .split('/')
    .map((part) =>
      part
        .replace(/[-_]/g, ' ')
        .replace(/^./, (letter) => letter.toUpperCase()),
    )
    .join(' / ')
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
    // Reuse Keystatic's existing session refresh; no extra API token is required.
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

export function PublishingPanel() {
  const [dirty, setDirty] = useState(false)
  const [review, setReview] = useState<PublishingStatus | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState(
    'Save your edits as drafts, then publish the finished batch.',
  )
  const [error, setError] = useState('')
  const dialog = useRef<HTMLDialogElement>(null)
  const toolbar = useRef<HTMLElement>(null)

  useEffect(() => {
    const onDirty = (event: Event) =>
      setDirty(Boolean((event as CustomEvent<boolean>).detail))
    window.addEventListener('keystatic:dirty', onDirty)
    const resize = new ResizeObserver(([entry]) => {
      document.documentElement.style.setProperty(
        '--keystatic-editor-height',
        `calc(100dvh - ${entry.target.getBoundingClientRect().height}px)`,
      )
    })
    if (toolbar.current) resize.observe(toolbar.current)
    return () => {
      window.removeEventListener('keystatic:dirty', onDirty)
      resize.disconnect()
    }
  }, [])

  const openReview = useCallback(async () => {
    if (dirty || busy) return
    setBusy(true)
    setError('')
    try {
      const status: PublishingStatus = await publishingRequest()
      if (!status.files.length) {
        setMessage('All saved changes have been published.')
        return
      }
      setReview(status)
      dialog.current?.showModal()
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setBusy(false)
    }
  }, [dirty, busy])

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
      dialog.current?.close()
      setReview(null)
      setMessage(
        'Batch published. The live site will update when the deployment finishes.',
      )
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <header className={styles.toolbar} ref={toolbar}>
        <div>
          <strong>Content drafts</strong>
          <p role="status">
            {dirty
              ? 'You have unsaved edits. Save draft before publishing.'
              : message}
          </p>
          {error && !review && (
            <p role="alert" className={styles.error}>
              {error}
            </p>
          )}
        </div>
        <button
          className={styles.primary}
          disabled={dirty || busy}
          onClick={openReview}
        >
          {busy && !review ? 'Checking changes…' : 'Review & publish'}
        </button>
      </header>
      <dialog
        ref={dialog}
        className={styles.dialog}
        onCancel={(event) => {
          if (busy) event.preventDefault()
          else {
            setReview(null)
            setError('')
          }
        }}
      >
        <h2>Publish saved changes</h2>
        <p>
          This publishes all saved drafts from the team. The live site updates
          after the deployment finishes.
        </p>
        <ul className={styles.changes}>
          {review?.files.map((file) => (
            <li key={file.filename}>
              <span>{changeLabel(file.filename)}</span>
              <small>{file.status}</small>
            </li>
          ))}
        </ul>
        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}
        <div className={styles.actions}>
          <button
            disabled={busy}
            onClick={() => {
              dialog.current?.close()
              setReview(null)
              setError('')
            }}
          >
            Keep editing
          </button>
          <button
            className={styles.primary}
            disabled={busy || dirty}
            onClick={publish}
          >
            {busy ? 'Publishing…' : 'Publish changes'}
          </button>
        </div>
      </dialog>
    </>
  )
}

'use client'
import { makePage } from '@keystatic/next/ui/app'
import config from './keystatic.config'
import { useEffect, useState } from 'react'
import { PublishingPanel, publishingRequest } from './publishing-panel'
import styles from './publishing.module.css'

const Editor = makePage(config)

export default function KeystaticApp() {
  const [state, setState] = useState<
    'loading' | 'ready' | 'signed-out' | 'error'
  >('loading')
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const local = config.storage.kind === 'local'
  useEffect(() => {
    if (local) return
    let active = true
    publishingRequest({ action: 'prepare' })
      .then(() => {
        if (active) setState('ready')
      })
      .catch((error) => {
        if (!active) return
        setState(error.status === 401 ? 'signed-out' : 'error')
        setError(error.message)
      })
    return () => {
      active = false
    }
  }, [local, attempt])
  if (local || state === 'signed-out') return <Editor />
  if (state !== 'ready')
    return (
      <main className={styles.loading}>
        <p role={state === 'error' ? 'alert' : 'status'}>
          {state === 'error' ? error : 'Opening your content drafts…'}
        </p>
        {state === 'error' && (
          <button
            onClick={() => {
              setState('loading')
              setAttempt((value) => value + 1)
            }}
          >
            Try again
          </button>
        )}
      </main>
    )
  return (
    <>
      <PublishingPanel />
      <Editor />
    </>
  )
}

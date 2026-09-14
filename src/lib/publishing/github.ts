import { DRAFT_BRANCH, PUBLISHED_BRANCH } from './config'

export class PublishingError extends Error {
  constructor(
    message: string,
    public status = 500,
  ) {
    super(message)
  }
}

type Ref = { object: { sha: string } }
export type ChangedFile = {
  filename: string
  previous_filename?: string
  patch?: string
  additions?: number
  deletions?: number
  status: string
}
type Comparison = { status: string; files?: ChangedFile[] }
export type PublishingStatus = {
  draftSha: string | null
  publishedSha: string
  files: ChangedFile[]
  comparisonUrl?: string
}

export function createPublisher(
  token: string,
  repository: string,
  request = fetch,
) {
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository)) {
    throw new PublishingError('The content repository is not configured.', 503)
  }
  async function github<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const response = await request(
      `https://api.github.com/repos/${repository}${endpoint}`,
      {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      },
    )
    if (!response.ok) {
      const messages: Record<number, string> = {
        401: 'Your login has expired. Sign in to Keystatic again.',
        403: 'GitHub did not allow this action. Check repository permissions, branch rules or rate limits.',
        404: 'The repository or draft branch could not be found.',
        409: 'The draft conflicts with newer published changes. Ask a developer to resolve the draft branch; your saved work is safe.',
        422: 'GitHub could not update this branch. Refresh and try again; branch rules may require a pull request.',
      }
      throw new PublishingError(
        messages[response.status] ?? 'GitHub is unavailable. Please try again.',
        response.status,
      )
    }
    return response.status === 204
      ? (undefined as T)
      : ((await response.json()) as T)
  }
  const getRef = (branch: string) => github<Ref>(`/git/ref/heads/${branch}`)

  async function authorize() {
    const repo = await github<{ permissions?: { push?: boolean } }>('')
    if (!repo.permissions?.push)
      throw new PublishingError(
        'You need write access to this repository to publish.',
        403,
      )
  }

  async function status(): Promise<PublishingStatus> {
    const published = await getRef(PUBLISHED_BRANCH)
    let draft: Ref
    try {
      draft = await getRef(DRAFT_BRANCH)
    } catch (error) {
      if (error instanceof PublishingError && error.status === 404) {
        return {
          publishedSha: published.object.sha,
          draftSha: null,
          files: [],
        }
      }
      throw error
    }
    const comparison = await github<Comparison>(
      `/compare/${published.object.sha}...${draft.object.sha}`,
    )
    // Behind/identical branches contain no unpublished content, even when their SHAs differ.
    const files = ['behind', 'identical'].includes(comparison.status)
      ? []
      : (comparison.files ?? [])
    if (files.length >= 300)
      throw new PublishingError(
        'This draft is too large to review here. Ask a developer to publish it through a pull request.',
        409,
      )
    const allowed = (file: string) =>
      /^(src\/content\/|public\/images\/)/.test(file) &&
      !file.split('/').includes('..')
    if (
      files.some(
        (file) =>
          !allowed(file.filename) ||
          (file.previous_filename && !allowed(file.previous_filename)),
      )
    ) {
      throw new PublishingError(
        'This draft includes application code. Ask a developer to review it before publishing.',
        409,
      )
    }
    return {
      publishedSha: published.object.sha,
      draftSha: draft.object.sha,
      files,
      comparisonUrl: `https://github.com/${repository}/compare/${published.object.sha}...${draft.object.sha}`,
    }
  }

  async function prepare() {
    const published = await getRef(PUBLISHED_BRANCH)
    try {
      await getRef(DRAFT_BRANCH)
    } catch (error) {
      if (!(error instanceof PublishingError) || error.status !== 404)
        throw error
      try {
        await github('/git/refs', {
          method: 'POST',
          body: JSON.stringify({
            ref: `refs/heads/${DRAFT_BRANCH}`,
            sha: published.object.sha,
          }),
        })
      } catch (creationError) {
        // Another editor may have created the same shared draft moments earlier.
        if (
          !(creationError instanceof PublishingError) ||
          creationError.status !== 422
        )
          throw creationError
        await getRef(DRAFT_BRANCH)
      }
    }
    // A normal merge preserves concurrent edits and fails on conflicts. Never reset/force-push.
    await github('/merges', {
      method: 'POST',
      body: JSON.stringify({
        base: DRAFT_BRANCH,
        head: published.object.sha,
        commit_message: 'Sync published changes into content drafts',
      }),
    })
    return status()
  }

  async function publish(expected: { draftSha: string; publishedSha: string }) {
    const current = await status()
    if (
      current.draftSha !== expected.draftSha ||
      current.publishedSha !== expected.publishedSha
    ) {
      throw new PublishingError(
        'Saved changes have changed since you reviewed them. Review the latest batch before publishing.',
        409,
      )
    }
    if (!current.files.length) return { published: false }
    // Merge the exact reviewed commit, never a moving branch name. Saves made
    // while publishing stay on the draft branch for the next batch.
    const result = await github<{ sha: string } | undefined>('/merges', {
      method: 'POST',
      body: JSON.stringify({
        base: PUBLISHED_BRANCH,
        head: expected.draftSha,
        commit_message: 'Publish content updates',
      }),
    })
    return { published: Boolean(result), sha: result?.sha }
  }
  return { authorize, status, prepare, publish }
}

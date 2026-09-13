import { test, expect, type Page } from '@playwright/test'
import { createHash } from 'node:crypto'

const main = 'a'.repeat(40)
const draft = 'b'.repeat(40)
const body =
  '---\ntitle: Contact us\ngeneral:\n  email: hello@example.test\n  phone: ""\nsydney:\n  email: ""\n  phone: ""\n  facebook: ""\n  instagram: ""\nwoopi:\n  email: ""\n  phone: ""\n  facebook: ""\n  instagram: ""\n---\nGet in touch.\n'
function gitSha(type: string, bytes: Uint8Array) {
  return createHash('sha1')
    .update(`${type} ${bytes.length}\0`)
    .update(bytes)
    .digest('hex')
}
function fixtureTree(content: string) {
  const blob = gitSha('blob', new TextEncoder().encode(content))
  const tree = (mode: string, name: string, sha: string) =>
    gitSha(
      'tree',
      Uint8Array.from([
        ...Array.from(new TextEncoder().encode(`${mode} ${name}\0`)),
        ...Array.from(Buffer.from(sha, 'hex')),
      ]),
    )
  const contentTree = tree('100644', 'contacts.mdx', blob)
  const sourceTree = tree('40000', 'content', contentTree)
  return {
    blob,
    sha: tree('40000', 'src', sourceTree),
    entries: [
      { path: 'src', mode: '040000', type: 'tree', sha: sourceTree },
      { path: 'src/content', mode: '040000', type: 'tree', sha: contentTree },
      {
        path: 'src/content/contacts.mdx',
        mode: '100644',
        type: 'blob',
        sha: blob,
      },
    ],
  }
}

async function mockEditor(page: Page, conflict = false) {
  page.on('pageerror', (error) =>
    console.error('Browser error:', error.message),
  )
  const commits: { branch: { branchName: string } }[] = []
  const publishes: object[] = []
  let savedBody = body
  let savedTree = fixtureTree(body)
  await page.context().addCookies([
    {
      name: 'keystatic-gh-access-token',
      value: 'test-only',
      domain: '127.0.0.1',
      path: '/',
    },
  ])
  await page.route('**/api/publishing', async (route) => {
    const request = route.request()
    const input =
      request.method() === 'POST' ? request.postDataJSON() : undefined
    if (input?.action === 'publish') {
      publishes.push(input)
      return route.fulfill({
        status: conflict ? 409 : 200,
        json: conflict
          ? {
              error:
                'Saved changes have changed since you reviewed them. Review the latest batch before publishing.',
            }
          : { published: true, sha: 'd'.repeat(40) },
      })
    }
    return route.fulfill({
      json: {
        draftSha: draft,
        publishedSha: main,
        files: [{ filename: 'src/content/contacts.mdx', status: 'modified' }],
      },
    })
  })
  await page.route('https://api.github.com/**', async (route) => {
    const url = new URL(route.request().url())
    if (url.pathname === '/graphql') {
      const { query, variables } = route.request().postDataJSON()
      const ref = (name: string) => ({
        __typename: 'Ref',
        id: `ref-${name}`,
        name,
        target: {
          __typename: 'Commit',
          id: `commit-${name}-${commits.length}`,
          oid: name === 'main' ? main : commits.length ? 'e'.repeat(40) : draft,
          tree: { __typename: 'Tree', id: savedTree.sha, oid: savedTree.sha },
        },
      })
      if (query.includes('mutation CreateCommit')) {
        commits.push(variables.input)
        savedBody = Buffer.from(
          variables.input.fileChanges.additions[0].contents,
          'base64',
        ).toString()
        savedTree = fixtureTree(savedBody)
        return route.fulfill({
          json: {
            data: {
              createCommitOnBranch: {
                __typename: 'CreateCommitOnBranchPayload',
                ref: ref('content-drafts'),
              },
            },
          },
        })
      }
      const repository = {
        __typename: 'Repository',
        id: 'repo',
        name: 'marketing-site',
        isPrivate: true,
        owner: { __typename: 'Organization', id: 'owner', login: 'example' },
        viewerPermission: 'WRITE',
        defaultBranchRef: ref('main'),
        refs: {
          __typename: 'RefConnection',
          nodes: [ref('main'), ref('content-drafts')],
          pageInfo: {
            __typename: 'PageInfo',
            hasNextPage: false,
            endCursor: null,
          },
        },
        forks: { __typename: 'RepositoryConnection', nodes: [] },
      }
      return route.fulfill({
        json: {
          data: {
            repository,
            viewer: {
              __typename: 'User',
              id: 'viewer',
              databaseId: 1,
              login: 'editor',
              name: 'Editor',
              avatarUrl: '',
            },
            node: {
              __typename: 'Ref',
              id: 'ref-content-drafts',
              associatedPullRequests: {
                __typename: 'PullRequestConnection',
                nodes: [],
              },
            },
          },
        },
      })
    }
    if (url.pathname.includes('/git/trees/'))
      return route.fulfill({
        json: {
          sha: savedTree.sha,
          truncated: false,
          tree: savedTree.entries,
        },
      })
    if (url.pathname.includes('/git/blobs/'))
      return route.fulfill({ body: savedBody, contentType: 'text/plain' })
    throw new Error(`Unexpected GitHub request: ${url.pathname}`)
  })
  return { commits, publishes }
}

test('saved drafts can be reviewed and published as one batch', async ({
  page,
}) => {
  const { publishes } = await mockEditor(page)
  await page.goto('/keystatic')
  await page.getByRole('button', { name: 'Review & publish' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByText('Contacts', { exact: true })).toBeVisible()
  await page
    .getByRole('button', { name: 'Publish changes', exact: true })
    .click()
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(
    page.getByRole('status').filter({ hasText: 'Batch published' }),
  ).toBeVisible()
  expect(publishes).toEqual([
    { action: 'publish', draftSha: draft, publishedSha: main },
  ])
})

test('a stale batch stays open with a useful error', async ({ page }) => {
  await mockEditor(page, true)
  await page.goto('/keystatic')
  await page.getByRole('button', { name: 'Review & publish' }).click()
  await page
    .getByRole('button', { name: 'Publish changes', exact: true })
    .click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('dialog').getByRole('alert')).toContainText(
    'Review the latest batch',
  )
})

test('unsaved editor state prevents publishing', async ({ page }) => {
  await mockEditor(page)
  await page.goto('/keystatic')
  await expect(
    page.getByRole('button', { name: 'Review & publish' }),
  ).toBeVisible()
  await page.evaluate(() =>
    window.dispatchEvent(new CustomEvent('keystatic:dirty', { detail: true })),
  )
  await expect(
    page.getByRole('button', { name: 'Review & publish' }),
  ).toBeDisabled()
  await expect(
    page
      .getByRole('status')
      .filter({ hasText: 'Save draft before publishing' }),
  ).toBeVisible()
})

test('small screens keep publishing controls accessible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await mockEditor(page)
  await page.goto('/keystatic')
  await page.getByRole('button', { name: 'Review & publish' }).click()
  await expect(
    page.getByRole('button', { name: 'Publish changes', exact: true }),
  ).toBeInViewport()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
})

test('editing a direct main-branch URL still saves only to drafts', async ({
  page,
}, testInfo) => {
  const { commits, publishes } = await mockEditor(page)
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/keystatic/branch/main/singleton/contacts')
  await expect(page.getByLabel('Title', { exact: true })).toHaveValue(
    'Contact us',
  )
  await page
    .getByLabel('Title', { exact: true })
    .fill('Updated contact details')
  await expect(
    page.getByRole('button', { name: 'Review & publish' }),
  ).toBeDisabled()
  await page.getByRole('button', { name: 'Save draft', exact: true }).click()
  await expect.poll(() => commits.length).toBe(1)
  expect(commits[0].branch.branchName).toBe('content-drafts')
  await expect(
    page.getByRole('button', { name: 'Review & publish' }),
  ).toBeEnabled()
  await page.screenshot({ path: testInfo.outputPath('draft-editor.png') })
  expect(publishes).toEqual([])
  expect(errors).toEqual([])
})

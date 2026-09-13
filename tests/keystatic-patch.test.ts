import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { createRequire } from 'node:module'
import { DRAFT_BRANCH } from '../src/lib/publishing/config'

const require = createRequire(import.meta.url)
const uiPath = require.resolve('@keystatic/core/ui')
const dist = path.dirname(uiPath)

test('installed CMS patch locks direct branch URLs and labels saved drafts', () => {
  const ui = readFileSync(path.join(dist, 'keystatic-core-ui.js'), 'utf8')
  assert.ok(ui.includes('branch = config.ui?.draftBranch ?? params[1]'))
  assert.ok(ui.includes('branch.branchName !== args.config.ui.draftBranch'))
  assert.ok(ui.includes('keystatic:dirty'))
  assert.ok(ui.includes('const t21 = "Save draft"'))
})

test('draft branch never triggers automatic Vercel deployments', () => {
  const config = JSON.parse(readFileSync('vercel.json', 'utf8'))
  assert.equal(config.git.deploymentEnabled[DRAFT_BRANCH], false)
  assert.equal(Object.keys(config.git.deploymentEnabled).length, 1)
})

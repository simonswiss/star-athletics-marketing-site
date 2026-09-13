import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import sharp from 'sharp'
import { optimizeImages, walk } from '../scripts/optimize-images.mjs'

test('transparent PNG remains pixel-identical, references update, and second run changes nothing', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'star-images-'))
  try {
    await mkdir(path.join(root, 'public/images'), { recursive: true })
    await mkdir(path.join(root, 'src/content'), { recursive: true })
    const original = await sharp({
      create: { width: 640, height: 400, channels: 4, background: '#12345680' },
    })
      .png({ compressionLevel: 0 })
      .toBuffer()
    await writeFile(path.join(root, 'public/images/test image.png'), original)
    await writeFile(
      path.join(root, 'src/content/page.mdx'),
      'image: /images/test image.png\n![Alt](/images/test%20image.png)\n',
    )
    const result = await optimizeImages(root)
    assert.equal(result.length, 1)
    assert.equal(result[0].quality, 'lossless')
    const output = await readFile(path.join(root, result[0].output))
    assert.deepEqual(
      await sharp(original).raw().toBuffer(),
      await sharp(output).raw().toBuffer(),
    )
    const metadata = await sharp(output).metadata()
    assert.equal(metadata.width, 640)
    assert.equal(metadata.height, 400)
    assert.equal(metadata.hasAlpha, true)
    const content = await readFile(
      path.join(root, 'src/content/page.mdx'),
      'utf8',
    )
    assert.ok(!content.includes('.png'))
    assert.ok(content.includes('.webp'))
    const files = await walk(root)
    const before = await Promise.all(files.map((file) => readFile(file)))
    assert.deepEqual(await optimizeImages(root), [])
    assert.deepEqual(await walk(root), files)
    assert.deepEqual(
      await Promise.all(files.map((file) => readFile(file))),
      before,
    )
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

import { createHash } from 'node:crypto'
import { readdir, readFile, writeFile, unlink } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

export async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const filename = path.join(directory, entry.name)
      return entry.isDirectory()
        ? walk(filename)
        : entry.isFile()
          ? [filename]
          : []
    }),
  )
  return files.flat().sort()
}

export function psnr(a, b) {
  if (a.length !== b.length) throw new Error('Image dimensions do not match')
  let error = 0
  for (let i = 0; i < a.length; i++) error += (a[i] - b[i]) ** 2
  return error === 0 ? Infinity : 10 * Math.log10(255 ** 2 / (error / a.length))
}

async function pixels(input, width) {
  // Decode before resizing so JPEG/WebP decoder shrink shortcuts do not skew
  // the quality comparison with different resampling algorithms.
  const decoded = await sharp(input).rotate().png().toBuffer()
  return sharp(decoded)
    .resize({ width, withoutEnlargement: true })
    .flatten({ background: '#fff' })
    .removeAlpha()
    .toColourspace('srgb')
    .raw()
    .toBuffer()
}

// Preserve enough source resolution. Compare at both 800px and 1920px (the site's common
// display and retina widths). Require substantially less error than Next's
// default WebP quality 75, then verify the resulting second encode as well.
export async function compressImage(input, { maxWidth, photo = false } = {}) {
  const metadata = await sharp(input).metadata()
  if ((metadata.pages ?? 1) > 1) return null // Never flatten animated images.
  if (!['jpeg', 'png', 'webp'].includes(metadata.format)) return null
  const normalized = await sharp(input).rotate().png().toBuffer()
  const reference = maxWidth
    ? await sharp(normalized)
        .resize({ width: maxWidth, withoutEnlargement: true })
        .png()
        .toBuffer()
    : normalized
  const referenceMetadata = await sharp(reference).metadata()
  const widths = [
    ...new Set([
      Math.min(800, referenceMetadata.width),
      Math.min(1920, referenceMetadata.width),
    ]),
  ]
  const baselines = await Promise.all(
    widths.map(async (width) => {
      const original = await pixels(reference, width)
      const decoded = reference
      const served = await sharp(decoded)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 75 })
        .toBuffer()
      const servedPixels = await pixels(served, width)
      return {
        width,
        original,
        servedPixels,
        score: psnr(original, servedPixels),
      }
    }),
  )
  // PNGs can be logos, charts or text: preserve their decoded pixels losslessly.
  // For photos, high-quality JPEG can outperform WebP for noisy originals.
  const candidates = !photo
    ? [{ format: 'webp', quality: null }]
    : [
        { format: 'jpeg', quality: 92 },
        { format: 'webp', quality: 90 },
        { format: 'jpeg', quality: 95 },
        { format: 'webp', quality: 95 },
        { format: 'webp', quality: null },
      ]
  for (const { format, quality } of candidates) {
    if (format === 'jpeg' && metadata.hasAlpha) continue
    const pipeline = sharp(reference)
    const output = await (
      format === 'jpeg'
        ? pipeline.jpeg({ quality, mozjpeg: true, chromaSubsampling: '4:4:4' })
        : pipeline.webp(
            quality === null
              ? { lossless: true, effort: 6 }
              : { quality, effort: 6, smartSubsample: true },
          )
    ).toBuffer()
    if (output.length >= input.length) continue
    const checks = await Promise.all(
      baselines.map(async (baseline) => {
        const source = await pixels(output, baseline.width)
        const decoded = await sharp(output).png().toBuffer()
        const served = await sharp(decoded)
          .resize({ width: baseline.width, withoutEnlargement: true })
          .webp({ quality: 75 })
          .toBuffer()
        const sourcePsnr = psnr(baseline.original, source)
        const servedPixels = await pixels(served, baseline.width)
        const servedPsnr = psnr(baseline.original, servedPixels)
        return {
          width: baseline.width,
          sourcePsnr,
          servedPsnr,
          baselinePsnr: baseline.score,
          passed:
            quality === null ||
            (sourcePsnr >= Math.max(38, baseline.score + 3) &&
              servedPsnr >= baseline.score - 0.5),
        }
      }),
    )
    if (checks.every((check) => check.passed))
      return {
        output,
        format,
        quality: quality ?? 'lossless',
        width: referenceMetadata.width,
        height: referenceMetadata.height,
        checks,
      }
  }
  return null // Keep the original if a smaller file cannot meet the quality gate.
}

export async function optimizeImages(
  root = process.cwd(),
  { reportPath } = {},
) {
  const publicRoot = path.join(root, 'public')
  const cachePath = path.join(root, '.image-optimization-cache.json')
  let cache = { version: 4, unchanged: [] }
  try {
    const saved = JSON.parse(await readFile(cachePath, 'utf8'))
    if (saved.version === cache.version) cache = saved
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  const unchanged = new Set(cache.unchanged)
  const images = (await walk(publicRoot)).filter((file) =>
    /\.(jpe?g|png|webp)$/i.test(file),
  )
  const report = []
  const replacements = new Map()
  const obsolete = []
  for (const file of images) {
    const input = await readFile(file)
    const relative = path.relative(publicRoot, file).split(path.sep).join('/')
    const testimonial = relative.startsWith('images/testimonials/')
    const photo =
      testimonial ||
      relative.startsWith('images/coaches/') ||
      /\.jpe?g$/i.test(file)
    const maxWidth = testimonial ? 320 : photo ? 2560 : undefined
    const digest = createHash('sha256').update(input).digest('hex').slice(0, 12)
    const cacheKey = `${maxWidth ?? 'original'}:${photo}:${digest}`
    if (unchanged.has(cacheKey)) continue
    const result = await compressImage(input, { maxWidth, photo })
    if (!result) {
      unchanged.add(cacheKey)
      report.push({
        file: path.relative(root, file),
        before: input.length,
        after: input.length,
      })
      continue
    }
    const outputHash = createHash('sha256')
      .update(result.output)
      .digest('hex')
      .slice(0, 12)
    const target = file.replace(
      /(?:-[a-f0-9]{12})?\.(jpe?g|png|webp)$/i,
      `-${outputHash}.${result.format}`,
    )
    await writeFile(target, result.output)
    const targetPhoto =
      testimonial ||
      relative.startsWith('images/coaches/') ||
      result.format === 'jpeg'
    const targetWidth = testimonial ? 320 : targetPhoto ? 2560 : undefined
    unchanged.add(`${targetWidth ?? 'original'}:${targetPhoto}:${outputHash}`)
    const oldUrl =
      '/' + path.relative(publicRoot, file).split(path.sep).join('/')
    const newUrl =
      '/' + path.relative(publicRoot, target).split(path.sep).join('/')
    replacements.set(oldUrl, newUrl)
    obsolete.push(file)
    report.push({
      file: path.relative(root, file),
      output: path.relative(root, target),
      before: input.length,
      after: result.output.length,
      quality: result.quality,
      width: result.width,
      height: result.height,
      checks: result.checks,
    })
    console.log(
      `${path.relative(root, file)}: ${(input.length / 1024).toFixed(0)} → ${(result.output.length / 1024).toFixed(0)} KB (${result.quality})`,
    )
  }
  // These are the only places this site stores public image references. Rewrite
  // both normal and URL-encoded paths, including MDX image URLs with spaces.
  for (const file of await walk(path.join(root, 'src'))) {
    if (!/\.(mdx?|ya?ml|json|[jt]sx?)$/i.test(file)) continue
    const input = await readFile(file, 'utf8')
    let output = input
    for (const [from, to] of replacements) {
      output = output
        .split(from)
        .join(to)
        .split(encodeURI(from))
        .join(encodeURI(to))
    }
    if (input !== output) await writeFile(file, output)
  }
  // Only remove originals after all references were updated successfully.
  for (const file of obsolete) await unlink(file)
  await writeFile(
    cachePath,
    JSON.stringify(
      { version: cache.version, unchanged: [...unchanged].sort() },
      null,
      2,
    ) + '\n',
  )
  const before = report.reduce((sum, item) => sum + item.before, 0)
  const after = report.reduce((sum, item) => sum + item.after, 0)
  console.log(
    `Images inspected: ${images.length}; converted: ${obsolete.length}; ${(before / 1e6).toFixed(2)} → ${(after / 1e6).toFixed(2)} MB`,
  )
  if (reportPath)
    await writeFile(
      reportPath,
      JSON.stringify({ before, after, images: report }, null, 2) + '\n',
    )
  return report
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  await optimizeImages(process.cwd(), {
    reportPath: process.env.IMAGE_REPORT_PATH,
  })
}

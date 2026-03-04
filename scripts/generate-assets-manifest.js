import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []
  for (const e of entries) {
    const res = path.resolve(dir, e.name)
    if (e.isDirectory()) {
      files.push(...await walk(res))
    } else {
      files.push(res)
    }
  }
  return files
}

async function hashFile(file) {
  const data = await fs.readFile(file)
  const h = crypto.createHash('sha256')
  h.update(data)
  return h.digest('hex')
}

async function main() {
  const dist = path.resolve(process.cwd(), 'dist')
  try {
    const stat = await fs.stat(dist)
    if (!stat.isDirectory()) throw new Error('dist is not a directory')
  } catch (e) {
    console.error('dist directory not found; run build first')
    process.exit(1)
  }

  const files = await walk(dist)
  const manifest = {}
  for (const f of files) {
    const rel = path.relative(dist, f).replace(/\\\\/g, '/')
    // skip source maps
    if (rel.endsWith('.map')) continue
    const h = await hashFile(f)
    manifest[rel] = {
      hash: h,
      size: (await fs.stat(f)).size
    }
  }

  const outPath = path.join(dist, 'assets-manifest.json')
  await fs.writeFile(outPath, JSON.stringify(manifest, null, 2), 'utf8')
  console.log('Wrote', outPath)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})

import fs from 'fs/promises'
import path from 'path'
import { execSync } from 'child_process'

async function main() {
  const cwd = process.cwd()
  const distPath = path.join(cwd, 'dist', 'assets-manifest.json')
  const publicPath = path.join(cwd, 'public', 'assets-manifest.json')

  try {
    await fs.stat(distPath)
  } catch (e) {
    console.error('dist/assets-manifest.json not found; run build first')
    process.exit(1)
  }

  try {
    // Copy to public for deployments that serve from repo root
    await fs.copyFile(distPath, publicPath)
    console.log('Copied assets-manifest.json to public/')
  } catch (e) {
    console.error('Failed to copy assets-manifest.json to public:', e)
  }

  // Optional: SCP upload to remote server if environment variables provided
  const host = process.env.DEPLOY_SSH_HOST
  const user = process.env.DEPLOY_SSH_USER
  const destPath = process.env.DEPLOY_SSH_PATH // e.g. /var/www/html/

  if (host && user && destPath) {
    const remote = `${user}@${host}:${destPath.replace(/\\\\$/,'')}/assets-manifest.json`
    try {
      console.log(`Uploading assets-manifest.json to ${remote} via scp...`)
      execSync(`scp ${distPath} ${remote}`, { stdio: 'inherit' })
      console.log('Upload complete')
    } catch (e) {
      console.error('SCP upload failed:', e.message || e)
    }
  } else {
    console.log('No remote deploy environment configured (set DEPLOY_SSH_HOST/DEPLOY_SSH_USER/DEPLOY_SSH_PATH to enable scp upload).')
  }
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})

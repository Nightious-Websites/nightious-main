import { readdir, stat } from 'node:fs/promises'
import path from 'node:path'

const VIDEO_DIR = path.resolve('public/videos')
const MAX_FILE_SIZE_MB = 3.5
const MAX_TOTAL_SIZE_MB = 60

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...(await listFiles(fullPath)))
    else files.push(fullPath)
  }

  return files
}

function toMB(bytes) {
  return bytes / (1024 * 1024)
}

const files = await listFiles(VIDEO_DIR)
let totalBytes = 0
let hasError = false

for (const file of files) {
  const info = await stat(file)
  totalBytes += info.size

  const fileMB = toMB(info.size)
  if (fileMB > MAX_FILE_SIZE_MB) {
    hasError = true
    console.error(`❌ File exceeds ${MAX_FILE_SIZE_MB} MB: ${path.relative(process.cwd(), file)} (${fileMB.toFixed(2)} MB)`)
  }
}

const totalMB = toMB(totalBytes)
if (totalMB > MAX_TOTAL_SIZE_MB) {
  hasError = true
  console.error(`❌ Total video size exceeds ${MAX_TOTAL_SIZE_MB} MB: ${totalMB.toFixed(2)} MB`)
}

if (hasError) {
  process.exit(1)
}

console.log(`✅ Media budget passed. ${files.length} file(s), ${totalMB.toFixed(2)} MB total.`)

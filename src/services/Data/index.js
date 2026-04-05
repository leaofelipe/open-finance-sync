const fs = require('fs/promises')
const path = require('path')

function getDataDir() {
  return path.resolve(__dirname, '../../..', process.env.DATA_FOLDER ?? 'data')
}

async function ensureDataDir() {
  const dir = getDataDir()
  await fs.mkdir(dir, { recursive: true })
  return dir
}

async function saveJSON(filename, data) {
  const safeName = path.basename(filename)
  const dir = await ensureDataDir()
  const filePath = path.join(dir, safeName)
  const content = JSON.stringify(data, null, 2)
  await fs.writeFile(filePath, content, 'utf8')
  console.log(`[Data] Saved JSON: ${filePath}`)
}

async function readJSON(filename) {
  const safeName = path.basename(filename)
  const filePath = path.join(getDataDir(), safeName)
  try {
    const content = await fs.readFile(filePath, 'utf8')
    return JSON.parse(content)
  } catch {
    return null
  }
}

module.exports = { saveJSON, readJSON }

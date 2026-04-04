const { parseIdList } = require('./pluggy-shared')
const { pluggyFetch } = require('./pluggy-client')

function parseItem(raw) {
  return {
    id: raw.id,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    status: raw.status,
    executionStatus: raw.executionStatus,
    lastUpdatedAt: raw.lastUpdatedAt,
    nextAutoSyncAt: raw.nextAutoSyncAt,
    autoSyncDisabledAt: raw.autoSyncDisabledAt,
  }
}

async function getItem(itemId) {
  const raw = await pluggyFetch(`/items/${encodeURIComponent(itemId)}`)
  return parseItem(raw)
}

async function fetchItems() {
  const ids = parseIdList(process.env.ITEM_IDS)
  return Promise.all(ids.map((id) => getItem(id)))
}

module.exports = { getItem, fetchItems }

const { getAccount } = require('./accounts')

function parseIdList(envValue) {
  if (!envValue || typeof envValue !== 'string') return []
  return envValue
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
}

async function fetchByAccountIds(accountIds) {
  return Promise.all(accountIds.map((accountId) => getAccount(accountId)))
}

module.exports = { parseIdList, fetchByAccountIds }

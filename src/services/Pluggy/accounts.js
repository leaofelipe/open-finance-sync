const { pluggyFetch } = require('./pluggy-client');

async function getAccounts(itemId) {
  const data = await pluggyFetch(`/accounts?itemId=${encodeURIComponent(itemId)}`);
  return data?.results ?? data;
}

async function getAccount(accountId) {
  return pluggyFetch(`/accounts/${encodeURIComponent(accountId)}`);
}

module.exports = { getAccounts, getAccount };

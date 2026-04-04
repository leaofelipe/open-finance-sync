const { pluggyFetch } = require('./pluggy-client');

async function getAccounts(itemId) {
  return pluggyFetch(`/accounts?itemId=${encodeURIComponent(itemId)}`);
}

async function getAccount(accountId) {
  return pluggyFetch(`/accounts/${encodeURIComponent(accountId)}`);
}

module.exports = { getAccounts, getAccount };

const { pluggyFetch } = require('./pluggy-client');

async function listConnectors({ name, types, isOpenFinance } = {}) {
  const params = new URLSearchParams();
  if (name) params.set('name', name);
  if (types) params.set('types', types.join(','));
  if (isOpenFinance !== undefined) params.set('isOpenFinance', isOpenFinance);

  const query = params.toString() ? `?${params}` : '';
  return pluggyFetch(`/connectors${query}`);
}

async function getConnector(connectorId) {
  return pluggyFetch(`/connectors/${encodeURIComponent(connectorId)}`);
}

module.exports = { listConnectors, getConnector };

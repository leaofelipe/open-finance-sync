const { pluggyFetch } = require('./pluggy-client');

function buildTransactionsPath({ accountId, from, to, page, pageSize }) {
  const params = new URLSearchParams();
  params.set('accountId', accountId);
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  if (page != null && !Number.isNaN(page)) params.set('page', String(page));
  if (pageSize != null && !Number.isNaN(pageSize)) {
    params.set('pageSize', String(pageSize));
  }
  return `/transactions?${params.toString()}`;
}

function parseTransaction(raw) {
  return {
    id: raw.id,
    description: raw.description,
    amount: raw.amount,
    date: raw.date,
    category: raw.category,
    categoryId: raw.categoryId,
    accountId: raw.accountId,
    type: raw.type,
    operationType: raw.operationType,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    status: raw.status,
  };
}

function mapTransactionsResponse(data) {
  if (Array.isArray(data)) {
    return data.map(parseTransaction);
  }
  if (data && Array.isArray(data.results)) {
    return {
      ...data,
      results: data.results.map(parseTransaction),
    };
  }
  return data;
}

async function getTransactions({ accountId, from, to, page, pageSize }) {
  const path = buildTransactionsPath({ accountId, from, to, page, pageSize });
  const data = await pluggyFetch(path);
  return mapTransactionsResponse(data);
}

async function fetchTransactionsByAccountId(accountId, query = {}) {
  const { from, to, page, pageSize } = query;
  return getTransactions({ accountId, from, to, page, pageSize });
}

module.exports = {
  getTransactions,
  fetchTransactionsByAccountId,
};

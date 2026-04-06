const { pluggyFetch } = require('./pluggy-client');

function parseBill(raw) {
  return {
    dueDate: raw.dueDate,
    totalAmount: raw.totalAmount,
  };
}

async function fetchBillsByAccountId(accountId) {
  const data = await pluggyFetch(`/bills?accountId=${accountId}`);
  if (data && Array.isArray(data.results)) {
    return data.results.map(parseBill);
  }
  return [];
}

module.exports = {
  fetchBillsByAccountId,
};

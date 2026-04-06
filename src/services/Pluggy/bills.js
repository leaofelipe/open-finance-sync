const { pluggyFetch } = require('./pluggy-client');

function parseFinanceCharge(raw) {
  return {
    type: raw.type,
    amount: raw.amount,
  };
}

function parseBill(raw) {
  return {
    dueDate: raw.dueDate,
    totalAmount: raw.totalAmount,
    financeCharges: Array.isArray(raw.financeCharges)
      ? raw.financeCharges.map(parseFinanceCharge)
      : [],
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

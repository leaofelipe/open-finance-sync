const { parseIdList, fetchByAccountIds } = require('./pluggy-shared')

const CREDIT_DATA_KEYS = [
  'level',
  'brand',
  'balanceCloseDate',
  'balanceDueDate',
  'availableCreditLimit',
  'balanceForeignCurrency',
  'minimumPayment',
  'creditLimit',
  'status',
]

function parseCreditCard(raw) {
  const out = {
    id: raw.id,
    name: raw.name,
    balance: raw.balance,
    itemId: raw.itemId,
    number: raw.number,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  }
  const creditData = raw.creditData ?? {}
  for (const key of CREDIT_DATA_KEYS) {
    if (Object.prototype.hasOwnProperty.call(creditData, key)) {
      out[key] = creditData[key]
    }
  }
  return out
}

async function fetchCreditCards() {
  const ids = parseIdList(process.env.CREDIT_CARD_IDS)
  const results = await fetchByAccountIds(ids)
  return results.map(parseCreditCard)
}

module.exports = { fetchCreditCards }

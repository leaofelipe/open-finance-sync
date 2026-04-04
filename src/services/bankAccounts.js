const { parseIdList, fetchByAccountIds } = require('./pluggy-shared')

const BANK_DATA_ROOT_KEYS = [
  'closingBalance',
  'overdraftContractedLimit',
  'overdraftUsedLimit',
  'unarrangedOverdraftAmount',
]

function parseBankAccount(raw) {
  const out = {
    id: raw.id,
    name: raw.name,
    balance: raw.balance,
    itemId: raw.itemId,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  }
  const bankData = raw.bankData ?? {}
  for (const key of BANK_DATA_ROOT_KEYS) {
    if (Object.prototype.hasOwnProperty.call(bankData, key)) {
      out[key] = bankData[key]
    }
  }
  return out
}

async function fetchBankAccounts() {
  const ids = parseIdList(process.env.BANK_ACCOUNT_IDS)
  const results = await fetchByAccountIds(ids)
  return results.map(parseBankAccount)
}

module.exports = { fetchBankAccounts }

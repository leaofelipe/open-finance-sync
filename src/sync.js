const { fetchItems } = require('./services/Pluggy/items');
const { getAccounts } = require('./services/Pluggy/accounts');
const { fetchTransactionsByAccountId } = require('./services/Pluggy/transactions');
const { saveJSON } = require('./services/Data');

function getLast15DaysFrom() {
  const date = new Date();
  date.setDate(date.getDate() - 15);
  return date.toISOString().split('T')[0];
}

async function withTransactions(account) {
  const { results } = await fetchTransactionsByAccountId(account.id, {
    from: getLast15DaysFrom(),
  });
  return { ...account, transactions: results };
}

async function sync() {
  const items = await fetchItems();
  await saveJSON('sync_status.json', items);
  const allAccounts = (
    await Promise.all(items.map((item) => getAccounts(item.id)))
  ).flat();

  const accounts = await Promise.all(
    allAccounts.filter((a) => a.type === 'BANK').map(withTransactions)
  );
  await saveJSON('accounts.json', accounts);

  const creditCards = await Promise.all(
    allAccounts.filter((a) => a.type === 'CREDIT').map(withTransactions)
  );
  await saveJSON('credit_cards.json', creditCards);
}

if (require.main === module) {
  sync().catch((error) => {
    console.error('Sync failed:', error);
    process.exit(1);
  });
}

module.exports = { sync };

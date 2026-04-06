require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { fetchItems } = require('./services/Pluggy/items');
const { getAccounts } = require('./services/Pluggy/accounts');
const { fetchTransactionsByAccountId } = require('./services/Pluggy/transactions');
const { saveJSON, readJSON } = require('./services/Data');

const DEFAULT_DAYS_PAST = 15;
const DEFAULT_DAYS_FUTURE = 0;

function parseEnvInt(value, defaultValue) {
  const n = Number.parseInt(value, 10);
  return Number.isNaN(n) ? defaultValue : n;
}

function getTransactionDateWindow() {
  const daysPast = parseEnvInt(process.env.TRANSACTION_DAYS_PAST, DEFAULT_DAYS_PAST);
  const daysFuture = parseEnvInt(process.env.TRANSACTION_DAYS_FUTURE, DEFAULT_DAYS_FUTURE);

  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - daysPast);
  const from = fromDate.toISOString().split('T')[0];

  const toDate = new Date();
  toDate.setDate(toDate.getDate() + daysFuture);
  const to = toDate.toISOString().split('T')[0];

  return { from, to };
}

async function withTransactions(account) {
  const { from, to } = getTransactionDateWindow();
  const { results } = await fetchTransactionsByAccountId(account.id, {
    from,
    to,
  });
  return { ...account, transactions: results };
}

async function isCacheValid() {
  const cached = await readJSON('sync_status.json');
  if (!cached || cached.length === 0) return false;

  const maxNextSync = Math.max(
    ...cached.map((item) => new Date(item.nextAutoSyncAt).getTime())
  );
  return Date.now() <= maxNextSync;
}

async function sync() {
  console.time('[Sync] Done');

  if (await isCacheValid()) {
    console.log('[Sync] Cache is valid, skipping requests.');
    console.timeEnd('[Sync] Done');
    return;
  }
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
  console.timeEnd('[Sync] Done');
}

if (require.main === module) {
  sync().catch((error) => {
    console.error('Sync failed:', error);
    process.exit(1);
  });
}

module.exports = { sync };

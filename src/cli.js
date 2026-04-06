const { readJSON } = require('./services/Data');

const args = process.argv.slice(2);
const command = args[0];
const hasTableFlag = args.includes('--table');
const hasTransactionsFlag = args.includes('--transactions');

function formatCurrency(amount, currencyCode = 'BRL') {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currencyCode,
  });
  return formatter.format(amount);
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR');
}

function stripExtras(data) {
  if (!Array.isArray(data)) return data;
  return data.map((item) => {
    const copy = { ...item };
    if (!hasTransactionsFlag) delete copy.transactions;
    return copy;
  });
}

function printAccountsTable(accounts) {
  console.log('\nBANK ACCOUNTS');
  console.log('─'.repeat(100));

  for (const account of accounts) {
    const name = account.name?.trim() || '-';
    const subtype = account.subtype || '-';
    const number = account.number || '-';
    const balance = formatCurrency(account.balance, account.currencyCode);

    console.log(
      `${name.padEnd(35)} ${subtype.padEnd(20)} ${number.padEnd(20)} ${balance}`
    );

    if (hasTransactionsFlag && account.transactions && account.transactions.length > 0) {
      for (const tx of account.transactions.slice(0, 15)) {
        const txDate = formatDate(tx.date);
        const txDesc = (tx.description || '').substring(0, 40).padEnd(40);
        const txAmount = formatCurrency(tx.amount, account.currencyCode);
        console.log(`  ${txDate}  ${txDesc}  ${txAmount}`);
      }
    }
  }
  console.log();
}

function printCreditCardsTable(cards) {
  console.log('\nCREDIT CARDS');
  console.log('─'.repeat(100));

  for (const card of cards) {
    const name = card.name?.trim() || '-';
    const brand = card.creditData?.brand || '-';
    const number = card.number || '-';
    const balance = formatCurrency(card.balance, card.currencyCode);
    const limit = card.creditData?.creditLimit
      ? formatCurrency(card.creditData.creditLimit, card.currencyCode)
      : '-';
    const dueDate = formatDate(card.creditData?.balanceDueDate);

    console.log(
      `${name.padEnd(35)} ${brand.padEnd(10)} ${number.padEnd(8)} Balance: ${balance.padEnd(15)} Due: ${dueDate.padEnd(12)} Limit: ${limit}`
    );

    if (hasTransactionsFlag && card.transactions && card.transactions.length > 0) {
      for (const tx of card.transactions.slice(0, 15)) {
        const txDate = formatDate(tx.date);
        const txDesc = (tx.description || '').substring(0, 40).padEnd(40);
        const txAmount = formatCurrency(tx.amount, card.currencyCode);
        console.log(`  ${txDate}  ${txDesc}  ${txAmount}`);
      }
    }

    if (card.bills && card.bills.length > 0) {
      console.log('  BILLS');
      for (const bill of card.bills) {
        const billDue = formatDate(bill.dueDate);
        const billTotal = formatCurrency(bill.totalAmount, card.currencyCode);
        console.log(`    Due: ${billDue}  Total: ${billTotal}`);
      }
    }
  }
  console.log();
}

async function main() {
  if (!command) {
    console.error('Usage: bun src/cli.js <command> [--transactions] [--table]');
    console.error('Commands: accounts, credit-cards');
    process.exit(1);
  }

  let data;

  if (command === 'accounts') {
    data = await readJSON('accounts.json');
  } else if (command === 'credit-cards') {
    data = await readJSON('credit_cards.json');
  } else {
    console.error(`Unknown command: ${command}`);
    console.error('Commands: accounts, credit-cards');
    process.exit(1);
  }

  if (!data) {
    console.error(`No data found for command: ${command}`);
    process.exit(1);
  }

  if (hasTableFlag) {
    if (command === 'accounts') {
      printAccountsTable(data);
    } else {
      printCreditCardsTable(data);
    }
  } else {
    const output = stripExtras(data);
    console.log(JSON.stringify(output, null, 2));
  }
}

main().catch((error) => {
  console.error('CLI Error:', error);
  process.exit(1);
});

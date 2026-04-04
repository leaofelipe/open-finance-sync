#!/usr/bin/env node

require('dotenv').config()

const { Command } = require('commander')
const {
  fetchBankAccounts,
  fetchCreditCards,
  fetchItems,
  getAccount,
  getAccounts,
  getItem,
  getTransactions,
} = require('./services/pluggy-service')

function printJson(data) {
  console.log(JSON.stringify(data, null, 2))
}

function exitErr(err) {
  const msg = err && err.message ? err.message : String(err)
  console.error(msg)
  process.exit(1)
}

const program = new Command()
program
  .name('open-finance-service')
  .description('Open Finance Service — CLI for Pluggy API (items, accounts, cards, transactions)')

program
  .command('items')
  .description('Fetch items for IDs in ITEM_IDS')
  .action(async () => {
    try {
      printJson(await fetchItems())
    } catch (err) {
      exitErr(err)
    }
  })

program
  .command('item')
  .description('Fetch a single item by id')
  .requiredOption('--id <uuid>', 'Pluggy item id')
  .action(async (opts) => {
    try {
      printJson(await getItem(opts.id))
    } catch (err) {
      exitErr(err)
    }
  })

const accountsCmd = program
  .command('accounts')
  .description('List accounts by item or fetch one by id')

accountsCmd
  .command('list')
  .description('List accounts for a Pluggy item')
  .requiredOption('--item-id <uuid>', 'Pluggy item id')
  .action(async (opts) => {
    try {
      printJson(await getAccounts(opts.itemId))
    } catch (err) {
      exitErr(err)
    }
  })

accountsCmd
  .command('get')
  .description('Fetch a single account by id')
  .requiredOption('--id <uuid>', 'Pluggy account id')
  .action(async (opts) => {
    try {
      printJson(await getAccount(opts.id))
    } catch (err) {
      exitErr(err)
    }
  })

program
  .command('bank-accounts')
  .description('Fetch bank accounts for IDs in BANK_ACCOUNT_IDS')
  .action(async () => {
    try {
      printJson(await fetchBankAccounts())
    } catch (err) {
      exitErr(err)
    }
  })

program
  .command('credit-cards')
  .description('Fetch credit cards for IDs in CREDIT_CARD_IDS')
  .action(async () => {
    try {
      printJson(await fetchCreditCards())
    } catch (err) {
      exitErr(err)
    }
  })

program
  .command('transactions')
  .description('List transactions for an account')
  .requiredOption('--account-id <uuid>', 'Pluggy account id')
  .option('--from <date>', 'Start date (YYYY-MM-DD)')
  .option('--to <date>', 'End date (YYYY-MM-DD)')
  .option('--page <n>', 'Page number')
  .option('--page-size <n>', 'Page size')
  .action(async (opts) => {
    try {
      const page =
        opts.page !== undefined
          ? Number.parseInt(String(opts.page), 10)
          : undefined
      const pageSize =
        opts.pageSize !== undefined
          ? Number.parseInt(String(opts.pageSize), 10)
          : undefined
      printJson(
        await getTransactions({
          accountId: opts.accountId,
          from: opts.from,
          to: opts.to,
          page: Number.isNaN(page) ? undefined : page,
          pageSize: Number.isNaN(pageSize) ? undefined : pageSize,
        })
      )
    } catch (err) {
      exitErr(err)
    }
  })

program.parseAsync(process.argv).catch(exitErr)

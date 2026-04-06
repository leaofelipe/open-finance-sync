# open-finance-sync

[![Bun](https://img.shields.io/badge/bun-%3E%3D1.1-000000?logo=bun&logoColor=white)](https://bun.sh/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Pluggy integration library for Bun that syncs open finance data (bank accounts and credit cards) from multiple financial institutions and provides a CLI to view the cached data.

Built on the [Pluggy Open Finance API](https://docs.pluggy.ai/).

## Prerequisites

- [Bun](https://bun.sh/) 1.1 or newer
- A Pluggy account with client credentials

## Setup

1. Install dependencies:

```bash
bun install
```

2. Configure environment variables:

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

Then edit `.env` with your credentials:

| Variable | Required | Description |
|----------|----------|-------------|
| `PLUGGY_CLIENT_ID` | Yes | Pluggy API client ID |
| `PLUGGY_CLIENT_SECRET` | Yes | Pluggy API client secret |
| `ITEM_IDS` | Yes | Comma-separated list of Pluggy item IDs to sync |
| `DATA_FOLDER` | No | Directory to store cached data (defaults to `data/`) |
| `TRANSACTION_DAYS_PAST` | No | Days before today to include in transactions (defaults to `15`) |
| `TRANSACTION_DAYS_FUTURE` | No | Days after today to include in transactions (defaults to `0`) |

Example:

```env
PLUGGY_CLIENT_ID=your-client-id-here
PLUGGY_CLIENT_SECRET=your-client-secret-here
ITEM_IDS=item-id-1,item-id-2,item-id-3
DATA_FOLDER=data
```

## Usage

### Sync data from Pluggy API

```bash
bun run sync
```

To always hit the API even when `sync_status.json` says the cache is still valid:

```bash
bun src/sync.js --force
# or, via the npm/bun script (pass arguments after --):
bun run sync -- --force
```

Fetches items, bank accounts, and credit cards with transactions within the configured date window from the Pluggy API. By default, fetches up to the last 15 days of transactions and no future transactions. Data is saved to the configured `DATA_FOLDER` directory.

**Smart caching:** Subsequent runs skip API calls if the cache is still valid (based on Pluggy's `nextAutoSyncAt` timestamps). Use `--force` to bypass that check.

Output files:
- `sync_status.json` — Item metadata and sync status
- `accounts.json` — Bank accounts with transactions
- `credit_cards.json` — Credit cards with transactions

### View cached data via CLI

```bash
bun run cli <command> [flags]
```

#### Commands

| Command | Description |
|---------|-------------|
| `accounts` | Show bank accounts |
| `credit-cards` | Show credit cards |

#### Flags

| Flag | Description |
|------|-------------|
| `--table` | Format output as a readable table (default: JSON) |
| `--transactions` | Include transactions (default: omitted); table mode shows up to 15, JSON mode shows all |

#### Examples

```bash
# Alternatively, run the CLI directly
bun src/cli.js <command> [flags]

# View all bank accounts as JSON
bun run cli accounts

# View accounts as JSON including all transactions
bun run cli accounts --transactions

# View accounts in a formatted table
bun run cli accounts --table

# View accounts with recent transactions in table format
bun run cli accounts --table --transactions

# View credit cards as JSON
bun run cli credit-cards

# View credit cards as JSON including all transactions
bun run cli credit-cards --transactions

# View credit cards with transactions in table format
bun run cli credit-cards --table --transactions
```

## Project Structure

```
src/
  sync.js                      Sync orchestrator; fetches from Pluggy API
  cli.js                       CLI viewer for cached data
  services/
    Pluggy/
      pluggy-client.js         Pluggy API client with auth caching
      pluggy-shared.js         Shared utilities
      items.js                 Item fetching
      accounts.js              Bank account fetching
      creditCards.js           Credit card fetching
      transactions.js          Transaction fetching
      bankAccounts.js          Utility for bank account parsing
    Data/
      index.js                 Local JSON read/write (respects DATA_FOLDER)
data/                          Local cache (gitignored)
```

## How it works

1. **Sync workflow:**
   - Unless `--force` is passed, check if cached data is still valid by comparing `Date.now()` with `nextAutoSyncAt` from `sync_status.json`
   - If valid, skip API calls
   - If stale or forced, fetch all items and their associated accounts/transactions
   - Save results to `data/`

2. **CLI workflow:**
   - Read cached JSON files from `data/`
   - Format and display based on command and flags
   - No API calls made by the CLI

## License

MIT

## Docs

- [Pluggy API Reference](https://docs.pluggy.ai/reference)
- [Pluggy Documentation](https://docs.pluggy.ai/docs)

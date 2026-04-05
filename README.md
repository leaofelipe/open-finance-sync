# Pluggy Integration

[![Bun](https://img.shields.io/badge/bun-%3E%3D1.1-000000?logo=bun&logoColor=white)](https://bun.sh/)

Pluggy integration library for Bun. Provides modules to fetch and manage connection data via the [Pluggy Open Finance API](https://docs.pluggy.ai/).

API reference: [Pluggy API Reference](https://docs.pluggy.ai/reference). Overview: [Pluggy docs](https://docs.pluggy.ai/docs).

## Prerequisites

- [Bun](https://bun.sh/) 1.1 or newer (see `engines` in [`package.json`](package.json))
- Copy [`env.example`](.env.example) to `.env` and set `PLUGGY_CLIENT_ID`, `PLUGGY_CLIENT_SECRET`, and any required ID lists (`ITEM_IDS`, `BANK_ACCOUNT_IDS`, `CREDIT_CARD_IDS`)

## Structure

- `src/services/Pluggy`: Modules for interacting with the Pluggy API (accounts, items, transactions, credit cards, etc.)

## Setup

```bash
bun install
```


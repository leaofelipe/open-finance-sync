import * as pluggy from './services/Pluggy/pluggy-service.js';
import { openDatabase, persistConnectionItems } from './services/Database/index.js';

async function main() {
  const items = await pluggy.fetchItems();

  const db = openDatabase();
  try {
    persistConnectionItems(db, items);
  } finally {
    db.close();
  }

  console.error(`Sync OK: connection_items=${items.length}`);
}

main().catch((err) => {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(msg);
  process.exit(1);
});

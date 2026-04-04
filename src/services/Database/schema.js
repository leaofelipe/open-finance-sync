export function migrate(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS connection_items (
      id TEXT PRIMARY KEY NOT NULL,
      created_at TEXT,
      updated_at TEXT,
      status TEXT,
      execution_status TEXT,
      last_updated_at TEXT,
      next_auto_sync_at TEXT,
      auto_sync_disabled INTEGER NOT NULL DEFAULT 0 CHECK (auto_sync_disabled IN (0, 1))
    );
  `);
}

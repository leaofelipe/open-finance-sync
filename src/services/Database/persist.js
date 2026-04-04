function normalizeDatetime(value) {
  if (value == null || value === '') return null;
  const t = Date.parse(value);
  if (Number.isNaN(t)) return null;
  return new Date(t).toISOString();
}

function autoSyncDisabledFromApi(value) {
  return value != null && String(value).trim() !== '' ? 1 : 0;
}

const upsertConnectionItemStatement = (db) =>
  db.prepare(`
    INSERT INTO connection_items (
      id, created_at, updated_at, status, execution_status,
      last_updated_at, next_auto_sync_at, auto_sync_disabled
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      created_at = excluded.created_at,
      updated_at = excluded.updated_at,
      status = excluded.status,
      execution_status = excluded.execution_status,
      last_updated_at = excluded.last_updated_at,
      next_auto_sync_at = excluded.next_auto_sync_at,
      auto_sync_disabled = excluded.auto_sync_disabled
  `);

export function upsertConnectionItem(db, row) {
  upsertConnectionItemStatement(db).run(
    row.id,
    normalizeDatetime(row.createdAt),
    normalizeDatetime(row.updatedAt),
    row.status ?? null,
    row.executionStatus ?? null,
    normalizeDatetime(row.lastUpdatedAt),
    normalizeDatetime(row.nextAutoSyncAt),
    autoSyncDisabledFromApi(row.autoSyncDisabledAt),
  );
}

export function persistConnectionItems(db, items) {
  const run = db.transaction(() => {
    for (const row of items) upsertConnectionItem(db, row);
  });
  run();
}

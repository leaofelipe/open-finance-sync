import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { Database } from 'bun:sqlite';
import { migrate } from './schema.js';

export function openDatabase(path) {
  const p = path ?? process.env.DATABASE_PATH ?? 'data/data.sqlite';
  mkdirSync(dirname(p), { recursive: true });
  const db = new Database(p, { create: true });
  db.exec('PRAGMA foreign_keys = ON');
  migrate(db);
  return db;
}

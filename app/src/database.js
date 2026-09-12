const { DatabaseSync } = require("node:sqlite");
const path = require("path");
const fs = require("fs");

const databasePath =
  process.env.DATABASE_PATH ||
  path.join(__dirname, "..", "data", "app.db");

fs.mkdirSync(path.dirname(databasePath), {
  recursive: true
});

const db = new DatabaseSync(databasePath);

db.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'operational'
  );

  CREATE TABLE IF NOT EXISTS incidents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id)
  );
`);

module.exports = db;
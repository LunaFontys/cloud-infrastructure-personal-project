const { DatabaseSync } = require("node:sqlite");
const path = require("path");

const databasePath = path.join(__dirname, "..", "data", "app.db");

const db = new DatabaseSync(databasePath);

db.exec(`
  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'operational'
  )
`);

module.exports = db;
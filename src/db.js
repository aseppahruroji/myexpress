const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db.sqlite");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS dokter (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS jadwal (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dokter_id INTEGER,
      day TEXT,
      time_start TEXT,
      time_finish TEXT,
      quota INTEGER,
      status BOOLEAN,
      tanggal TEXT,
      FOREIGN KEY(dokter_id) REFERENCES dokter(id)
    )
  `);
});

module.exports = db;

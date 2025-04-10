const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Request body kosong" });
  }
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Nama dokter wajib diisi" });
  }

  db.run("INSERT INTO dokter (name) VALUES (?)", [name], function (err) {
    if (err)
      return res.status(500).json({ message: "Gagal insert", error: err });
    res.json({ message: "Dokter ditambahkan", id: this.lastID });
  });
});

router.get("/", auth, (req, res) => {
  db.all("SELECT * FROM dokter", [], (err, rows) => {
    if (err)
      return res.status(500).json({ message: "Gagal ambil data", error: err });
    res.json(rows);
  });
});

module.exports = router;

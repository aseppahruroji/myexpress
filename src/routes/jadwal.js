const express = require("express");
const moment = require("moment");
require("moment/locale/id"); // tambahkan ini
moment.locale("id");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Request body kosong" });
  }
  const { dokter_id, day, time_start, time_finish, quota, status, date_range } =
    req.body;

  db.get("SELECT * FROM dokter WHERE id = ?", [dokter_id], (err, dokter) => {
    if (err)
      return res.status(500).json({ message: "Gagal cek dokter", error: err });
    if (!dokter)
      return res.status(404).json({ message: "Dokter tidak ditemukan" });

    const [startDateStr, endDateStr] = date_range.split(" s/d ");
    const startDate = moment(startDateStr, "YYYY-MM-DD");
    const endDate = moment(endDateStr, "YYYY-MM-DD");

    let current = startDate.clone();
    const insertJadwal = [];

    while (current.isSameOrBefore(endDate)) {
      if (current.format("dddd").toLowerCase() === day.toLowerCase()) {
        insertJadwal.push(current.format("YYYY-MM-DD"));
      }
      current.add(1, "day");
    }

    const stmt = db.prepare(`
      INSERT INTO jadwal (dokter_id, day, time_start, time_finish, quota, status, tanggal)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertJadwal.forEach((tanggal) => {
      stmt.run(dokter_id, day, time_start, time_finish, quota, status, tanggal);
    });

    stmt.finalize();

    res.json({ message: "Jadwal berhasil dibuat" });
  });
});

router.get("/", auth, (req, res) => {
  db.all(
    `SELECT a.*, d.name as doctor_name 
    FROM jadwal a
    JOIN dokter d ON a.dokter_id = d.id
    ORDER BY a.tanggal ASC
  `,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Error", error: err });
      const result = rows.map((row) => ({
        ...row,
        status: Boolean(row.status),
      }));
      res.json({ message: "berhasil", body: result });
    }
  );
});

module.exports = router;

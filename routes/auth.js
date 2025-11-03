const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // <-- IMPORT KONEKSI DB MYSQL KITA

// Ambil JWT_SECRET dari .env
const JWT_SECRET = process.env.JWT_SECRET;

// === RUTE REGISTER ===
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Cek user sudah ada atau belum di DB
    const sqlCheck = "SELECT * FROM users WHERE username = ?";
    const [existingUsers] = await db.query(sqlCheck, [username]);

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Username sudah dipakai' });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Simpan user baru ke DB
    const sqlInsert = "INSERT INTO users (username, password) VALUES (?, ?)";
    const [result] = await db.query(sqlInsert, [username, hashedPassword]);

    console.log('User terdaftar:', { id: result.insertId, username });
    res.status(201).json({ message: 'Registrasi berhasil!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// === RUTE LOGIN ===
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Cari user di DB
    const sqlFind = "SELECT * FROM users WHERE username = ?";
    const [users] = await db.query(sqlFind, [username]);

    if (users.length === 0) {
      // Username tidak ditemukan
      return res.status(400).json({ message: 'Username atau password salah' });
    }

    const user = users[0];

    // 2. Cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Password salah
      return res.status(400).json({ message: 'Username atau password salah' });
    }

    // 3. Buat Token (JWT)
    const token = jwt.sign(
      { userId: user.id, username: user.username }, // pake user.id dari MySQL
      JWT_SECRET,
      { expiresIn: '1h' } // Token berlaku 1 jam
    );

    res.json({
      message: 'Login berhasil!',
      token: token,
      user: {
        id: user.id, // Kirim id
        username: user.username
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
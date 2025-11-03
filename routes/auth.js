// server/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Database bohongan (ganti ini dengan database asli nanti, misal MongoDB/PostgreSQL)
const users = []; 

const JWT_SECRET = 'rahasia-banget-jangan-disebar'; // Taruh di .env file di project asli

// === RUTE REGISTER ===
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cek user sudah ada atau belum
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username sudah dipakai' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru
    const newUser = { id: users.length + 1, username, password: hashedPassword };
    users.push(newUser);

    console.log('User terdaftar:', users); // Cek di console server
    res.status(201).json({ message: 'Registrasi berhasil!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// === RUTE LOGIN ===
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cari user
    const user = users.find(user => user.username === username);
    if (!user) {
      return res.status(400).json({ message: 'Username atau password salah' });
    }

    // Cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Username atau password salah' });
    }

    // Buat Token (JWT)
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' } // Token berlaku 1 jam
    );

    res.json({
      message: 'Login berhasil!',
      token: token,
      user: {
        id: user.id,
        username: user.username
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
// server/index.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Mengizinkan request dari frontend
app.use(express.json()); // Biar bisa baca req.body format JSON

// Routes
app.use('/api/auth', authRoutes); // Semua rute di auth.js akan diawali /api/auth

app.get('/', (req, res) => {
  res.send('Server Backend Aktif!');
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
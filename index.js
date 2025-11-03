const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth'); // Pastikan ini mengarah ke file auth.js

// Panggil konfigurasi dotenv
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Server Backend Aktif!');
});

// Langsung jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  console.log('Terhubung ke database MySQL:', process.env.DB_NAME);
});
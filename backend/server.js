const express = require('express');
const cors = require('cors');
const path = require('path'); // ← agrega esto
const authRoutes = require('./routes/authRoutes');
const pcRoutes = require('./routes/pcRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// ← Sirve los archivos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/auth', authRoutes);
app.use('/api/computadoras', pcRoutes);

const PORT = process.env.PORT || 3000;
app.post('/api/auth/login', (req, res, next) => {
  console.log('📥 Login intentado:', req.body);
  next();
});
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
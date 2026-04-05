const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const pincodeRoutes = require('./routes/pincodeRoutes');

dotenv.config();

connectDB();

const app = express();

// CORS — allow all origins (needed for Vercel frontend to talk to Render backend)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health-check root route (Render pings this)
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'PinCode Explorer API is running' });
});

app.use('/api', pincodeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

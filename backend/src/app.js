const express = require('express');
const cors = require('cors');
const config = require('./config');
const csvRoutes = require('./routes/csv.routes');
const errorHandler = require('./middleware/error.middleware');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/csv', csvRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;

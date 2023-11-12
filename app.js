import express from 'express';
import cors from 'cors';
import nocRoutes from './routes/nocRoutes.js'
import studentRoutes from './routes/studentRoutes.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/v1/student', studentRoutes);
app.use('/api/v1/noc', nocRoutes);

// Rest Apiiiiii
app.get('/', (req, res) => {
  res.send('<h1>Welcome to Student NOC Generator </h1>');
});

// 404 Error Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message,
  });
});

export default app;

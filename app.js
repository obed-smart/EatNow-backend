import express from 'express';
import morgan from 'morgan';
import errorMiddleware from './src/middlewares/error.middleware.js';
import AppError from './src/utils/appErrors.js';
import authRoutes from './src/modules/auth/authRoutes.js';

const app = express();

app.use(express.json({ limit: '10kb' }));

// ROUTES
app.get('/', (req, res) => {
       res.send('eatNow Backend Server is running!');
});

app.use('/api/v1/auth', authRoutes);

app.use((req, res, next) => {
       next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorMiddleware);

export default app;

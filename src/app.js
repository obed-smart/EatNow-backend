import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import errorMiddleware from './middlewares/error.middleware.js';
import AppError from './utils/appErrors.js';
import authRoutes from './modules/auth/authRoutes.js';
import userRoutes from './modules/user/user.routers.js';

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(cookieParser());

// ROUTES
app.get('/', (_req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'eatNow Backend Server is running! on port 3000',
  });
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage().rss / 1024 / 1024 + ' MB',
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/vi/user', userRoutes);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorMiddleware);

export default app;

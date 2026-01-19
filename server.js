import dotenv from 'dotenv';
dotenv.config();

import logger from './src/utils/logger.js';

process.on('uncaughtException', (err) => {
      logger.error('UNCAUGHT EXCEPTION! Shutting down...');
      logger.error(err);
      process.exit(1);
});

import app from './src/app.js';
import connectDB from './src/config/db.js';

const startServer = async () => {
       await connectDB();


       const PORT = process.env.PORT || 3000;

       const server = app.listen(PORT, () => {
              logger.info(
                     `Server is running in ${process.env.NODE_ENV} at port ${PORT}`,
              );
       });

       process.on('unhandledRejection', (err) => {
              logger.error('UNHANDLED REJECTION! Shutting down...');
              logger.error(err);
              server.close(() => process.exit(1));
       });
};

startServer();

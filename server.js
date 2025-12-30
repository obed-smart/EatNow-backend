import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
       console.log(`Server is running on port ${PORT}`);
});


process.on('unhandledRejection', (err) => {
  console.log('unhandled Rejection!, shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.log('uncaught Exception, shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

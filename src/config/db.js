import mongoose from 'mongoose';

// const MONGODB_URI =
//        process.env.NODE_ENV === 'production'
//               ? process.env.DATABASE_PRODUCTION.replace(
//                        '<PASSWORD>',
//                        process.env.DATABASE_PASSWORD,
//                 )
//               : process.env.DATABASE_LOCAL;

const connectDB = async () => {
       try {
              await mongoose.connect(process.env.DATABASE_LOCAL);
              console.log('MongoDB connected');
       } catch (error) {
              console.error('MongoDB connection error:', error.message);
              process.exit(1);
       }
};

export default connectDB;

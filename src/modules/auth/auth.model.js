import mongoose from 'mongoose';
import { destination } from 'pino';
import validator from 'validator';

const userSchema = new mongoose.Schema({
       email: {
              type: String,
              required: [true, 'Email is required'],
              unique: true,
              lowercase: true,
              validate: [validator.isEmail, 'Please provide a valid email'],
       },
       password: {
              type: String,
              required: [true, 'Password is required'],
              trim: true,
              select: false,
              validate: {
                     validator: function (value) {
                            return validator.isStrongPassword(value, {
                                   minLength: 8,
                                   minLowercase: 1,
                                   minUppercase: 1,
                                   minNumbers: 1,
                                   minSymbols: 1,
                            });
                     },
                     message: 'Password must contain at least 1 lowercase, 1 uppercase, 1 number, 1 symbol, and be 8+ characters long.',
              },
       },

       name: {
              type: String,
              required: [true, 'Name is required'],
              min: [3, 'Name must be at least 3 characters long'],
       },
       photo: String,
       role: {
              type: String,
              enum: ['user', 'admin', 'employee', 'manager', 'delivery'],
              default: 'user',
       },
       location: [
              {
                     type: {
                            type: String,
                            enum: ['Point'],
                            default: 'Point',
                     },
                     coordinates: {
                            type: [Number],
                            validate: {
                                   validator: (coord) => {
                                          const [longitude, latitude] = coord;
                                          return (
                                                 longitude >= -180 &&
                                                 longitude <= 180 &&
                                                 latitude >= -90 &&
                                                 latitude <= 90
                                          );
                                   },
                                   message: 'Coordinates must be valid longitude and latitude values',
                            },
                     },

                     address: String,
                     tag: String,
              },
       ],
       phone: String,
       active: {
              type: Boolean,
              default: true,
              select: false,
       },
       createdAt: {
              type: Date,
              default: Date.now,
       },
       updatedAt: {
              type: Date,
              default: Date.now,
       },
       passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
       try {
              if (!this.isModified('password')) return next();
              this.password = await argon2.hash(this.password);
              next();
       } catch (err) {
              next(err);
       }
});

const User = mongoose.model('User', userSchema);

export default User;

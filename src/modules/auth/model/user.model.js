import mongoose from 'mongoose';
import validator from 'validator';
import argon2 from 'argon2';
import crypto from 'crypto';
import AppError from '../../../utils/appErrors.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      min: [3, 'Name must be at least 3 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },

    password: {
      type: String,
    },

    credentials: [
      {
        type: {
          type: String,
          enum: ['local', 'google', 'apple'],
          required: true,
          default: 'local',
        },

        authMode: {
          type: String,
          enum: ['password', 'oauth'],
          required: true,
          default: 'password',
        },

        providerId: String,

        passwordResetToken: String,
        passwordResetExpires: Date,
      },
    ],

    photo: String,
    role: {
      type: String,
      enum: ['user', 'admin', 'employee', 'manager', 'delivery'],
      default: 'user',
      select: false,
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
    phoneNumber: String,
    isActive: {
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
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  // for (let credential of this.credentials) {
  //   if (credential.type === 'local' && credential.password) {
  //     credential.password = await argon2.hash(credential.password);
  //   }
  // }

  this.password = await argon2.hash(this.password);
});

// method

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // const credential = this.credentials.find((c) => c.type === 'local');
    // if (!credential)
    //   throw new AppError('password field is not allow on this account', 400);
    return await argon2.verify(this.password, candidatePassword);
  } catch (error) {
    throw new AppError('Password comparison failed', 500);
  }
};

userSchema.methods.createPasswordResetToken = function () {
  const localCredential = this.credentials.find((c) => c.type === 'local');

  if (!localCredential)
    throw new AppError('password reset not supported for the account', 400);

  const resetToken = crypto.randomBytes(32).toString('hex');

  // console.log(localCredential);

  // const hashToken = ;

  localCredential.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  localCredential.passwordResetExpires = Date.now() + 5 * 60 * 1000;

  // this.markModified('credentials');
  return resetToken;
};

userSchema.index({ email: true }, { unique: true });
const User = mongoose.model('User', userSchema);

export default User;

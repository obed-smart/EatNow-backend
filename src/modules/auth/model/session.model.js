import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
       {
              userId: {
                     type: mongoose.Schema.Types.ObjectId,
                     ref: 'User',
                     required: true,
              },

              deviceId: {
                     type: String,
                     required: true,
              },

              refreshToken: {
                     type: String,
                     required: true,
                     unique: true,
                     select: false,
              },

              userAgent: String,

              lastUsedAt: Date,
              revokedAt: Date,
       },
       {
              timestamps: true,
       },
);
sessionSchema.index({ userId: true, lastUsedAt: -1 });
sessionSchema.index(
       { userId: 1, deviceId: 1 },
       {
              unique: true,
              partialFilterExpression: { revokedAt: null },
       },
);

export default mongoose.model('Session', sessionSchema);

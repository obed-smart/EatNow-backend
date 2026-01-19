import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const generateAccessToken = (user) => {
       const accessToken = jwt.sign(
              { id: user.id, role: user.role },
              process.env.JWT_ACCESS_SECRET,
              { expiresIn: '15m' },
       );
       return accessToken;
};

export const generateRefreshToken = () => {
       return crypto.randomBytes(32).toString('hex');
};

export const hashToken = (token) => {
       return crypto.createHash('sha256').update(token).digest('hex');
};

export const passwordResetHTML = (resetURL) => `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif;">
    <h2>Reset your password</h2>
    <p>You requested a password reset. Click the button below.</p>
    <a href="${resetURL}" style="padding:10px 20px; background:#007bff; color:#fff; border-radius:5px; text-decoration:none;">
      Reset Password
    </a>
    <p>This link expires in 5 minutes.</p>
    <p>If you did not request this, you can safely ignore this email.</p>
  </body>
</html>
`;

import jwt from 'jsonwebtoken';
import InvariantError from '../exceptions/invariant-error.js';
import logger from '../config/logger.js';

const TokenManager = {
  generateAccessToken: (payload) =>
    jwt.sign(payload, process.env.ACCESS_TOKEN_KEY),
  generateRefreshToken: (payload) =>
    jwt.sign(payload, process.env.REFRESH_TOKEN_KEY),
  verifyRefreshToken: (refreshToken) => {
    try {
      const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
      return payload;
    } catch (error) {
      logger.error('Refresh token verification failed: %o', error);
      throw new InvariantError('Refresh token tidak valid');
    }
  },
  verify: (accessToken, secret) => {
    try {
      const payload = jwt.verify(accessToken, secret);
      return payload;
    } catch (error) {
      logger.error('Access token verification failed: %o', error);
      throw new InvariantError('Access token tidak valid');
    }
  },
};

export default TokenManager;

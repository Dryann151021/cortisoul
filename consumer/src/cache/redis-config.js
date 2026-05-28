import { createClient } from 'redis';
import logger from '../config/logger.js';

class CacheService {
  constructor() {
    this._client = createClient({
      url: process.env.REDIS_URL,
    });

    this._client.on('error', (error) => {
      logger.error('Redis error:', error);
    });

    this._client.connect();
  }

  async delete(key) {
    return await this._client.del(key);
  }
}

export default CacheService;

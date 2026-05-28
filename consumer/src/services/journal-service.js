import pool from '../config/database.js';
import CacheService from '../cache/redis-config.js';
import { getWeekRange, formatToYmd } from '../utils/date.js';

class JournalService {
  constructor() {
    this._pool = pool;
    this.cacheService = new CacheService();
  }

  async updateJournalPrediction(id, stressScore, emotion, owner) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE journals SET stress_score = $1, emotion = $2, updated_at = $3 WHERE id = $4 RETURNING *',
      values: [stressScore, emotion, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (result.rows[0]) {
      await this._deleteCache(owner);
    }

    return result.rows[0];
  }

  async _deleteCache(owner) {
    const { start, end } = getWeekRange();
    const startDate = formatToYmd(start);
    const endDate = formatToYmd(end);

    await this.cacheService.delete(`journals:${owner}`);
    await this.cacheService.delete(
      `stressLevels:${owner}:${startDate}:${endDate}`
    );
    await this.cacheService.delete(
      `emotionSummary:${owner}:${startDate}:${endDate}`
    );
  }
}

export default JournalService;

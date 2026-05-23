import response from '../utils/response.js';

const verifyCronSecret = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.warn('[CronAuth] CRON_SECRET is not set in environment variables');
    return response(res, 500, 'Server misconfiguration', null);
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return response(res, 401, 'Unauthorized', null);
  }

  return next();
};

export default verifyCronSecret;

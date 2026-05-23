import express from 'express';
import {
  subscribe,
  unsubscribe,
  testNotification,
  triggerDailyNotifications,
} from '../controller/notifications-controller.js';
import { validate } from '../../../middlewares/validate.js';
import { subscribePayloadSchema } from '../validator/schema.js';
import authenticateToken from '../../../middlewares/auth.js';
import verifyCronSecret from '../../../middlewares/vercel-cron-auth.js';

const routes = express.Router();

routes.post(
  '/subscribe',
  authenticateToken,
  validate(subscribePayloadSchema),
  subscribe
);

routes.delete('/subscribe', authenticateToken, unsubscribe);

routes.post('/test', authenticateToken, testNotification);

routes.get('/daily-push', verifyCronSecret, triggerDailyNotifications);

export default routes;

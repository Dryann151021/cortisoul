import 'dotenv/config';

import amqp from 'amqplib';
import Listener from './listener.js';
import JournalService from './services/journal-service.js';
import predictService from './services/predict-services.js';
import logger from './config/logger.js';

const init = async () => {
  const journalService = new JournalService();
  const listener = new Listener(journalService, predictService);

  const url = process.env.RABBITMQ_URL;
  logger.info(`Connecting to RabbitMQ at ${url}`);
  const connection = await amqp.connect(url);
  const channel = await connection.createChannel();

  const queue = 'predict:journal';

  await channel.assertQueue(queue, { durable: true });

  logger.info(`[RabbitMQ] Consumer is listening to ${queue}`);

  channel.consume(queue, async (message) => {
    try {
      await listener.listen(message);
      channel.ack(message);
    } catch {
      setTimeout(() => {
        channel.nack(message);
      }, 5000);
    }
  });
};

init().catch(logger.error);

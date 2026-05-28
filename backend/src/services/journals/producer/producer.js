import amqp from 'amqplib';
import logger from '../../../config/logger.js';

const ProducerService = {
  sendMessage: async (queue, message) => {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      const channel = await connection.createChannel();

      await channel.assertQueue(queue, {
        durable: true,
      });

      channel.sendToQueue(queue, Buffer.from(message));
      logger.info(`[RabbitMQ] Sent message to ${queue}`);

      setTimeout(() => {
        connection.close();
      }, 1000);
    } catch (error) {
      logger.error('[RabbitMQ] Error sending message to queue: %o', error);
      throw error;
    }
  },
};

export default ProducerService;

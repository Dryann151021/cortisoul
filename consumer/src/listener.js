import logger from './config/logger.js';

class Listener {
  constructor(journalService, predictService) {
    this._journalService = journalService;
    this._predictService = predictService;
  }

  async listen(message) {
    try {
      if (message !== null) {
        const { journalId, content, owner } = JSON.parse(
          message.content.toString()
        );

        logger.info(
          `[RabbitMQ] Received message to predict journal: ${journalId}`
        );

        const prediction = await this._predictService(content);

        if (prediction) {
          const stressScoreValue = parseFloat(
            prediction.stress_score.toFixed(3)
          );
          const emotion = prediction.prediksi_label ?? null;

          await this._journalService.updateJournalPrediction(
            journalId,
            stressScoreValue,
            emotion,
            owner
          );

          logger.info(
            `[RabbitMQ] Successfully processed and updated journal: ${journalId}`
          );
        }
      } else {
        logger.info('[RabbitMQ] No message received');
      }
    } catch (error) {
      logger.error('[RabbitMQ] Failed to process message: %o', error);
      throw error;
    }
  }
}

export default Listener;

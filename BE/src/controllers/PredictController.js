import PredictService from '../services/PredictService.js';
class PredictController {
  async postPredict(req, res, next) {
    try {
      // TODO data Validate
      await PredictService.postSensorData(req.body);
      const result = await PredictService.getModelPredicts(req.body);
      const recommendations = result.map((item) => item.prediction);
      await PredictService.postMaintenaceRecommenndations(
        recommendations,
        req.body
      );
      const failureStatistics = result
        .map((item, index) => ({ ...item, originalIndex: index }))
        .filter((item) => item.failure.type != null)
        .map((item) => ({
          originalIndex: item.originalIndex,
          type: item.failure.type,
          confidence: item.failure.confidence,
          heat_dissipation_failure:
            item.failure.probabilities['Heat Dissipation Failure'],
          random_failures: item.failure.probabilities['Random Failures'],
          overstrain_failure: item.failure.probabilities['Overstrain Failure'],
          power_failure: item.failure.probabilities['Power Failure'],
          tool_wear_failure: item.failure.probabilities['Tool Wear Failure'],
        }));
      await PredictService.postFailureStatistics(failureStatistics, req.body);

      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }
}
export default new PredictController();

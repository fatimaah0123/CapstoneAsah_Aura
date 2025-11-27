import PredictService from '../services/PredictService.js';
class PredictController {
  async postPredict(req, res, next) {
    try {
      await PredictService.insertDataSensor(req.body);
      const result = await PredictService.postPredict(req.body);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }
}
export default new PredictController();

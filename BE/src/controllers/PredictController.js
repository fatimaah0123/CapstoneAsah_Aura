import PredictService from '../services/PredictService.js';
class PredictController {
  async postPredict(req, res, next) {
    try {
      const inputData = req.body;
      const rulResult = await PredictService.rulPredict(inputData);
      res.status(200).json({ status: 'success', rul: JSON.parse(rulResult) });
    } catch (error) {
      next(error);
    }
  }
}
export default new PredictController();

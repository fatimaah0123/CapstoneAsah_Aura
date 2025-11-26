import ModelService from '../services/ModelService.js';
class PredictController {
  async postPredict(req, res, next) {
    try {
      const inputData = req.body;
      const rulResult = await ModelService.rulPredict(inputData);
      res.status(200).json({ status: 'success', rul: JSON.parse(rulResult) });
    } catch (error) {
      next(error);
    }
  }
}
export default new PredictController();

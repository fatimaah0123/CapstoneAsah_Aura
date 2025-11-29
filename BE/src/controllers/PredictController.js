import PredictService from '../services/PredictService.js';
import { predictValidator } from '../validators/predict/index.js';
class PredictController {
  constructor() {}
  async createPredict(req, res, next) {
    try {
      const input = Array.isArray(req.body) ? req.body : [req.body];
      predictValidator.validateCreatePredict(input);
      await PredictService.createSensorData(input);
      const result = await PredictService.createPredicts(input);

      if (!result) {
        return next(new AppError('Gagal membuat prediksi', 400));
      }

      res.status(200).json({ status: 'success', message: 'Prediksi berhasil' });
    } catch (error) {
      next(error);
    }
  }
}
export default new PredictController();

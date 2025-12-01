import DashboardService from '../services/DashboardService.js';

class DashboardController {
  async getDashboardSummary(req, res, next) {
    try {
      const result = await DashboardService.getDashboardSummary();
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }

  async getDashboardTrend(req, res, next) {
    try {
      const { days = 5 } = req.query;
      const result = await DashboardService.getDashboardTrend(days);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }
}

export default new DashboardController();

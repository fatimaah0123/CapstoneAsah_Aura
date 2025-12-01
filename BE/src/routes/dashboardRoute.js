import express from 'express';
const Router = express.Router();

import DashboardController from '../controllers/DashboardController.js';

Router.get('/summary', DashboardController.getDashboardSummary);

Router.get('/trend', DashboardController.getDashboardTrend);

export default Router;

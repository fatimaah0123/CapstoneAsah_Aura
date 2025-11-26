import express from 'express';
const Router = express.Router();

import PredictController from '../controllers/PredictController.js';

Router.post('/predict', PredictController.postPredict);

export default Router;

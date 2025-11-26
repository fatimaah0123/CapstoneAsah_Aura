import express from 'express';
const Route = express.Router();

import PredictRoute from './predictRoute.js';

Route.use('/api', PredictRoute);

export default Route;

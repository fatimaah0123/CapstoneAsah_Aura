import express from 'express';
const Route = express.Router();

import PredictRoute from './predictRoute.js';
import MaintenanceTicketsRoute from '../routes/maintenanceTicketsRoute.js';

Route.use('/api/predict', PredictRoute);
Route.use('/api/maintenance-tickets', MaintenanceTicketsRoute);

export default Route;

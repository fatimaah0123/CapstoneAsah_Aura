import express from 'express';
import MaintenanceTicketsController from '../controllers/maintenanceTicketsController.js';

const Router = express.Router();

Router.get('/', MaintenanceTicketsController.getAllMaintenanceTickets);

Router.get('/:id', MaintenanceTicketsController.getMaintenanceTicketById);

Router.post('/', MaintenanceTicketsController.createMaintenanceTicket);

Router.put('/:id', MaintenanceTicketsController.updateMaintenanceTicket);

Router.delete('/:id', MaintenanceTicketsController.deleteMaintenanceTicket);

export default Router;

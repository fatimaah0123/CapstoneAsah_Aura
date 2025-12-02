import ChatbotController from '../controllers/ChatbotController.js';
import express from 'express';

const Router = express.Router();

Router.get('/', ChatbotController.askChatbot);

export default Router;

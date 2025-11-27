import express from 'express';
import 'dotenv/config';
import cors from 'cors';

import AppError from './utils/AppError.js';

import { errorHandler } from './middleware/errorHandler.js';
import Routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

app.use(express.json());
app.use(cors());

app.use(Routes);

app.all(/(.*)/, (req, res, next) => {
  next(new AppError(`Tidak dapat menemukan ${req.originalUrl}`, 404));
});

app.use(errorHandler);

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});

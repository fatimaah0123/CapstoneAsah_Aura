import express from 'express';
import 'dotenv/config';
import cors from 'cors';

import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

app.use(express.json());
app.use(cors());

app.use(errorHandler);

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});

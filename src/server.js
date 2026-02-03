import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { errors } from 'celebrate';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(logger);
app.use(express.json());
app.use(cors());
app.use(cookieParser());
// Auth routers
app.use(authRoutes);
// Notes routers
app.use(notesRoutes);
// Middleware 404
app.use(notFoundHandler);
// Celebrate errors
app.use(errors());
// Middleware Errors
app.use(errorHandler);
// Connect MongoDB
await connectMongoDB();
// Launch Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

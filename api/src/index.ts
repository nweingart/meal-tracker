import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { authMiddleware } from './middleware/auth';
import logRoutes from './routes/log';
import foodsRoutes from './routes/foods';
import profileRoutes from './routes/profile';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Protected routes
app.use('/api/log', authMiddleware as express.RequestHandler, logRoutes);
app.use('/api/foods', authMiddleware as express.RequestHandler, foodsRoutes);
app.use('/api/profile', authMiddleware as express.RequestHandler, profileRoutes);
app.use('/api/tracking', authMiddleware as express.RequestHandler, profileRoutes);

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

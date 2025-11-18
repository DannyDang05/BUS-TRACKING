import express from 'express';

const router = express.Router();

// Minimal web router: serve a health check and static placeholder
const initWebRouter = (app) => {
  router.get('/', (req, res) => res.send('Backend is running'));
  router.get('/health', (req, res) => res.json({ status: 'ok' }));

  app.use('/', router);
};

export default initWebRouter;

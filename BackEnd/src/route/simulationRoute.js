import express from 'express';
import { startTripSimulation, stopTripSimulation, getActiveSimulations } from '../controller/simulationController.js';
import verifyToken from '../middleWare/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// POST /api/v1/simulation/start - Start trip simulation
router.post('/start', startTripSimulation);

// POST /api/v1/simulation/stop - Stop trip simulation
router.post('/stop', stopTripSimulation);

// GET /api/v1/simulation/active - Get active simulations
router.get('/active', getActiveSimulations);

export default router;

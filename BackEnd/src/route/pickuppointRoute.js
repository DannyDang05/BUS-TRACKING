import express from 'express';
import { getPickupPoints, getPickupPointById, createPickupPoint, updatePickupPoint, deletePickupPoint, updatePickupStatus } from '../controller/pickuppointController.js';
const router = express.Router();

// public endpoints for pickup points
router.get('/', getPickupPoints);
router.get('/:id', getPickupPointById);
router.post('/', createPickupPoint);
router.put('/:id', updatePickupPoint);
router.put('/:id/status', updatePickupStatus);
router.delete('/:id', deletePickupPoint);

export default router;

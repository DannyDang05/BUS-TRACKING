import express from 'express';
import { 
  getPickupPoints, 
  getPickupPointById, 
  createPickupPoint, 
  updatePickupPoint, 
  deletePickupPoint, 
  updatePickupStatus,
  updateSchedulePickupStatus 
} from '../controller/pickuppointController.js';
const router = express.Router();

// public endpoints for pickup points
router.get('/', getPickupPoints);
router.get('/:id', getPickupPointById);
router.post('/', createPickupPoint);
router.put('/:id', updatePickupPoint);
router.put('/:id/status', updatePickupStatus);

// Cập nhật trạng thái đón/trả cho schedule cụ thể (đặt trước :id để tránh conflict)
router.put('/:scheduleId/:pickupPointId/status', updateSchedulePickupStatus);

router.delete('/:id', deletePickupPoint);

export default router;

import { Router } from 'express';

import { deliveryDriverController } from '../controllers/deliveryDriver.controller';

const router = Router();

router.get('/candidates/:id', deliveryDriverController.findDeliveryCandidates);
router.get('/clerk/:id', deliveryDriverController.getUserByClerkId);
router.put('/:id', deliveryDriverController.updateDriver);

export default router;
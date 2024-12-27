import { Router } from 'express';

import { deliveryDriverController } from '../controllers/deliveryDriver.controller';

const router = Router();

router.get('/candidates/:id', deliveryDriverController.findDeliveryCandidates);

export default router;
import { Router } from 'express';

import { deliveryDriverController } from '../controllers/deliveryDriver.controller';
import multer from 'multer';

const router = Router();
const upload = multer();

router.get('/:id', deliveryDriverController.getDriver);
router.get('/candidates/:id', deliveryDriverController.findDeliveryCandidates);
router.get('/clerk/:id', deliveryDriverController.getUserByClerkId);
router.put('/:id', upload.single('image'), deliveryDriverController.updateDriver);

export default router;
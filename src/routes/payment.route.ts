import { Router } from 'express';

import { paymentController } from '../controllers/payment.controller';

const router = Router();

router.post('/fetch-params', paymentController.generateParams);

export default router;
import { Router } from 'express';

import { paymentController } from '../controllers/payment.controller';

const router = Router();

router.post('/fetch-params', paymentController.generateParams);
router.post('/generate-payments-report', paymentController.generatePaymentReport);

export default router;
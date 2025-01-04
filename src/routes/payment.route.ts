import { Router } from 'express';

import { paymentController } from '../controllers/payment.controller';

const router = Router();

router.post('/payment-intent', paymentController.createPaymentIntent);
router.post('/pay', paymentController.pay);
router.post('/fetch-params', paymentController.generateParams);

export default router;
import express, { Router } from 'express';
import { stripeController } from '../controllers/stripe.controller';

const router = Router();

router.post('/webhook', express.raw({type: 'application/json'}), stripeController.handleWebhook);
router.post('/transfers', stripeController.getTransfers);

export default router;
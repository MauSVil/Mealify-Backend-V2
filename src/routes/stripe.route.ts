import express, { Router } from 'express';
import { stripeController } from '../controllers/stripe.controller';

const router = Router();

router.post('/webhook', express.raw({type: 'application/json'}), stripeController.handleWebhook);

export default router;
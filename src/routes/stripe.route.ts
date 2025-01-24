import express, { Router } from 'express';
import { stripeController } from '../controllers/stripe.controller';
import { requireAuth } from '@clerk/express';

const router = Router();

router.post('/webhook', express.raw({type: 'application/json'}), stripeController.handleWebhook);
router.post('/webhook2', express.raw({type: 'application/json'}), stripeController.handleWebhook);
router.post('/transfers', stripeController.getTransfers);
router.post('/create-session', stripeController.createSession);
router.get('/account', requireAuth(), stripeController.getAccount);
router.get('/generate-sign-in-link', requireAuth(), stripeController.generateSignInLink);

export default router;
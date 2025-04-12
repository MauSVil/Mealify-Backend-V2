import express, { Router } from 'express';
import { stripeController } from '../controllers/stripe.controller';
import { dynamicClerkMiddleware } from '../middlewares/clerkMiddleware';

const router = Router();

router.post('/webhook', express.raw({type: 'application/json'}), stripeController.handleWebhook);
router.post('/webhook2', express.raw({type: 'application/json'}), stripeController.handleWebhook2);
router.post('/transfers', stripeController.getTransfers);
router.post('/create-session', stripeController.createSession);
router.get('/account', dynamicClerkMiddleware, stripeController.getAccount);
router.get('/generate-sign-in-link', dynamicClerkMiddleware, stripeController.generateSignInLink);
router.get('/generate-sub-checkout-session', stripeController.generateSubCheckoutSession);

export default router;
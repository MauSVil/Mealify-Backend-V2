import { Router } from 'express';

import { orderController } from '../controllers/order.controller';
import { dynamicClerkMiddleware } from '../middlewares/clerkMiddleware';

const router = Router();

router.post('/accept-order', orderController.acceptOrder);
router.put('/', orderController.updateOrder);
router.get('/restaurant/all', orderController.getOrdersByRestaurant);
router.post('/payment-intent', orderController.getOrderByPaymentIntent);
router.get('/:id', orderController.getOrderById);
router.get('/', dynamicClerkMiddleware, orderController.getAllOrders);

export default router;
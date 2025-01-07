import { Router } from 'express';

import { orderController } from '../controllers/order.controller';

const router = Router();

router.get('/restaurant/all', orderController.getOrdersByRestaurant);
router.post('/payment-intent', orderController.getOrderByPaymentIntent);
router.get('/:id', orderController.getOrderById);
router.get('/', orderController.getAllOrders);

export default router;
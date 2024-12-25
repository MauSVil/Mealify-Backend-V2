import { Router } from 'express';

import { orderController } from '../controllers/order.controller';

const router = Router();

router.get('/:id', orderController.getOrderById);
router.get('/', orderController.getAllOrders);

export default router;
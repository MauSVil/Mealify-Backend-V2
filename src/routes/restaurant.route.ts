import { Router } from 'express';
import multer from 'multer';

import { restaurantsController } from '../controllers/restaurant.controller';
import { dynamicClerkMiddleware } from '../middlewares/clerkMiddleware';

const router = Router();

const upload = multer();

router.get('/orders', restaurantsController.getDeliveredOrders);
router.get('/totals', restaurantsController.getTotals);
router.get('/admin', dynamicClerkMiddleware, restaurantsController.getRestaurants);
router.get('/:latitude/:longitude/:query', restaurantsController.getCloseRestaurants);
router.get('/:id', restaurantsController.getRestaurantById);
router.get('/', dynamicClerkMiddleware, restaurantsController.getAllRestaurants);
router.post('/', upload.single('image'), dynamicClerkMiddleware, restaurantsController.addRestaurant);

export default router;
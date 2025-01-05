import { Router } from 'express';
import multer from 'multer';

import { restaurantsController } from '../controllers/restaurant.controller';
import { requireAuth } from '@clerk/express';

const router = Router();

const upload = multer();

router.get('/admin', requireAuth(), restaurantsController.getRestaurants);
router.get('/:latitude/:longitude', restaurantsController.getCloseRestaurants);
router.get('/:id', restaurantsController.getRestaurantById);
router.get('/', requireAuth(), restaurantsController.getAllRestaurants);
router.post('/', upload.single('image'), requireAuth(), restaurantsController.addRestaurant);

export default router;
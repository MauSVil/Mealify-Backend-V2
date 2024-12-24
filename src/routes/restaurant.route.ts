import { Router } from 'express';
import multer from 'multer';

import { restaurantsController } from '../controllers/restaurant.controller';

const router = Router();

const upload = multer();

router.get('/:latitude/:longitude', restaurantsController.getCloseRestaurants);
router.get('/:id', restaurantsController.getRestaurantById);
router.get('/', restaurantsController.getAllRestaurants);
router.post('/', upload.single('image'), restaurantsController.addRestaurant);

export default router;
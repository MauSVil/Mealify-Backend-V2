import { Router } from 'express';
import multer from 'multer';
import { productsController } from '../controllers/product.controller';


const router = Router();

const upload = multer();

router.get('/restaurant/:id', productsController.getProductsByRestaurantId);
router.get('/:id', productsController.getProductById);
router.get('/', productsController.getAllProducts);
router.post('/', upload.single('image'), productsController.addProduct);

export default router;
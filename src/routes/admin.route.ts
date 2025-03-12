import { Router } from 'express';

import { adminController } from '../controllers/admin.controller';
import { dynamicClerkMiddleware } from '../middlewares/clerkMiddleware';

const router = Router();

router.get('/', dynamicClerkMiddleware, adminController.getAdmin);
router.put('/', dynamicClerkMiddleware, adminController.updateAdmin);

export default router;
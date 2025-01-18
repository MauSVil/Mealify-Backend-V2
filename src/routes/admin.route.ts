import { Router } from 'express';

import { adminController } from '../controllers/admin.controller';
import { requireAuth } from '@clerk/express';

const router = Router();

router.get('/', requireAuth(), adminController.getAdmin);
router.put('/', requireAuth(), adminController.updateAdmin);

export default router;
import { Router } from 'express';

import { userAddressController } from '../controllers/userAddress.controller';

const router = Router();

router.get('/', userAddressController.getUserAddress);
router.post('/', userAddressController.createUserAddress);
router.put('/:id', userAddressController.updateUserAddress);
router.delete('/:id', userAddressController.deleteUserAddress);

export default router;
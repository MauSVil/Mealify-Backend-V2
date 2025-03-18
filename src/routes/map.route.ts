import { Router } from 'express';
import { mapController } from '../controllers/map.controller';


const router = Router();

router.get('/', (req, res) => {
  res.status(200).send('home')
});
router.get('/route', mapController.getRoute);

export default router;
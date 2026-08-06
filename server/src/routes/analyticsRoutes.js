import express from 'express';
import * as c from '../controllers/analyticsController.js';
const router = express.Router();

router.get('/dashboard', c.getDashboard);
router.get('/domains', c.getDomainDistribution);

export default router;

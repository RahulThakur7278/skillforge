/**
 * Route Aggregator
 *
 * Mounts all API route modules under their base paths.
 */

import express from 'express';
import skillRoutes from './skillRoutes.js';
import roleRoutes from './roleRoutes.js';
import graphRoutes from './graphRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';

const router = express.Router();

router.use('/skills', skillRoutes);
router.use('/roles', roleRoutes);
router.use('/graph', graphRoutes);
router.use('/analytics', analyticsRoutes);

export default router;

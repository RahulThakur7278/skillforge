/**
 * Route Aggregator
 *
 * Mounts all API route modules under their base paths.
 */

const router = require('express').Router();

router.use('/skills', require('./skillRoutes'));
router.use('/roles', require('./roleRoutes'));
router.use('/graph', require('./graphRoutes'));
router.use('/analytics', require('./analyticsRoutes'));

module.exports = router;

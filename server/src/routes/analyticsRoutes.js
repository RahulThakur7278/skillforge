const router = require('express').Router();
const c = require('../controllers/analyticsController');

router.get('/dashboard', c.getDashboard);
router.get('/domains', c.getDomainDistribution);

module.exports = router;

const router = require('express').Router();
const c = require('../controllers/graphController');

router.get('/network', c.getFullNetwork);
router.get('/skill-path', c.getSkillPathGraph);
router.get('/neighborhood/:type/:name', c.getNeighborhood);
router.get('/similar/:name', c.getSimilarProfessionals);
router.post('/skill-gap', c.analyzeSkillGap);

module.exports = router;

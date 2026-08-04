const router = require('express').Router();
const c = require('../controllers/skillController');

router.get('/', c.listSkills);
router.get('/categories', c.getCategories);
router.get('/path', c.getSkillPath);
router.get('/influence', c.getInfluence);
router.get('/bridges', c.getBridges);
router.get('/:name', c.getSkill);
router.get('/:name/complementary', c.getComplementary);

module.exports = router;

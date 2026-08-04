const router = require('express').Router();
const c = require('../controllers/roleController');

router.get('/', c.listRoles);
router.get('/levels', c.getRoleLevels);
router.get('/career-paths', c.getCareerPaths);
router.get('/:title', c.getRole);

module.exports = router;

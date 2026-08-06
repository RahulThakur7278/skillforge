import express from 'express';
import * as c from '../controllers/skillController.js';
const router = express.Router();

router.get('/', c.listSkills);
router.get('/categories', c.getCategories);
router.get('/path', c.getSkillPath);
router.get('/influence', c.getInfluence);
router.get('/bridges', c.getBridges);
router.get('/:name', c.getSkill);
router.get('/:name/complementary', c.getComplementary);

export default router;

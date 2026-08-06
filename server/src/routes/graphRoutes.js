import express from 'express';
import * as c from '../controllers/graphController.js';
const router = express.Router();

router.get('/network', c.getFullNetwork);
router.get('/skill-path', c.getSkillPathGraph);
router.get('/neighborhood/:type/:name', c.getNeighborhood);
router.get('/similar/:name', c.getSimilarProfessionals);
router.post('/skill-gap', c.analyzeSkillGap);

export default router;

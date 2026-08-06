import express from 'express';
import * as c from '../controllers/roleController.js';
const router = express.Router();

router.get('/', c.listRoles);
router.get('/levels', c.getRoleLevels);
router.get('/career-paths', c.getCareerPaths);
router.get('/:title', c.getRole);

export default router;

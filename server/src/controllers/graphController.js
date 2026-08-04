/**
 * Graph Controller
 */

const graphService = require('../services/graphService');

async function getNeighborhood(req, res, next) {
  try {
    const { type, name } = req.params;
    const { depth } = req.query;
    const valid = ['skill', 'role', 'domain', 'professional'];
    if (!valid.includes(type.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: { message: `Invalid node type "${type}". Valid types: ${valid.join(', ')}` },
      });
    }
    const data = await graphService.getNeighborhood(type, name, depth);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getFullNetwork(req, res, next) {
  try {
    const { limit } = req.query;
    const data = await graphService.getFullNetwork(limit);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function analyzeSkillGap(req, res, next) {
  try {
    const { currentSkills, targetRole } = req.body;
    if (!targetRole) {
      return res.status(400).json({ success: false, error: { message: '"targetRole" is required' } });
    }
    if (!Array.isArray(currentSkills)) {
      return res.status(400).json({ success: false, error: { message: '"currentSkills" must be an array' } });
    }
    const data = await graphService.analyzeSkillGap(currentSkills, targetRole);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getSimilarProfessionals(req, res, next) {
  try {
    const { name } = req.params;
    const { limit } = req.query;
    const data = await graphService.getSimilarProfessionals(name, limit);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getSkillPathGraph(req, res, next) {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return res.status(400).json({
        success: false,
        error: { message: 'Both "from" and "to" query parameters are required' },
      });
    }
    const data = await graphService.getSkillPathGraph(from, to);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getNeighborhood,
  getFullNetwork,
  analyzeSkillGap,
  getSimilarProfessionals,
  getSkillPathGraph,
};

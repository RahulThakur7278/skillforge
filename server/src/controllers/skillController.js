/**
 * Skill Controller
 *
 * HTTP request handlers for skill-related endpoints.
 * Maps requests to service calls and formats responses.
 */

const skillService = require('../services/skillService');

async function listSkills(req, res, next) {
  try {
    const { search, category, limit } = req.query;
    const skills = await skillService.listSkills({ search, category, limit });
    res.json({ success: true, data: skills, count: skills.length });
  } catch (err) {
    next(err);
  }
}

async function getSkill(req, res, next) {
  try {
    const skill = await skillService.getSkillByName(req.params.name);
    if (!skill) {
      return res.status(404).json({ success: false, error: { message: `Skill "${req.params.name}" not found` } });
    }
    res.json({ success: true, data: skill });
  } catch (err) {
    next(err);
  }
}

async function getCategories(_req, res, next) {
  try {
    const categories = await skillService.getCategories();
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
}

async function getSkillPath(req, res, next) {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return res.status(400).json({
        success: false,
        error: { message: 'Both "from" and "to" query parameters are required' },
      });
    }
    const path = await skillService.getSkillPath(from, to);
    if (!path) {
      return res.json({
        success: true,
        data: null,
        message: `No prerequisite path found from "${from}" to "${to}"`,
      });
    }
    res.json({ success: true, data: path });
  } catch (err) {
    next(err);
  }
}

async function getInfluence(req, res, next) {
  try {
    const { limit } = req.query;
    const skills = await skillService.getSkillInfluence(limit);
    res.json({ success: true, data: skills });
  } catch (err) {
    next(err);
  }
}

async function getBridges(_req, res, next) {
  try {
    const bridges = await skillService.getBridgeSkills();
    res.json({ success: true, data: bridges });
  } catch (err) {
    next(err);
  }
}

async function getComplementary(req, res, next) {
  try {
    const skills = await skillService.getComplementarySkills(req.params.name);
    res.json({ success: true, data: skills });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listSkills,
  getSkill,
  getCategories,
  getSkillPath,
  getInfluence,
  getBridges,
  getComplementary,
};

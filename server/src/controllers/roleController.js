/**
 * Role Controller
 */

const roleService = require('../services/roleService');

async function listRoles(req, res, next) {
  try {
    const { level, domain, limit } = req.query;
    const roles = await roleService.listRoles({ level, domain, limit });
    res.json({ success: true, data: roles, count: roles.length });
  } catch (err) {
    next(err);
  }
}

async function getRole(req, res, next) {
  try {
    const role = await roleService.getRoleByTitle(req.params.title);
    if (!role) {
      return res.status(404).json({ success: false, error: { message: `Role "${req.params.title}" not found` } });
    }
    res.json({ success: true, data: role });
  } catch (err) {
    next(err);
  }
}

async function getCareerPaths(req, res, next) {
  try {
    const { role } = req.query;
    if (!role) {
      return res.status(400).json({ success: false, error: { message: '"role" query parameter is required' } });
    }
    const paths = await roleService.getCareerPaths(role);
    res.json({ success: true, data: paths });
  } catch (err) {
    next(err);
  }
}

async function getRoleLevels(_req, res, next) {
  try {
    const levels = await roleService.getRoleLevels();
    res.json({ success: true, data: levels });
  } catch (err) {
    next(err);
  }
}

module.exports = { listRoles, getRole, getCareerPaths, getRoleLevels };

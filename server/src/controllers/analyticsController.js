/**
 * Analytics Controller
 */

import * as analyticsService from '../services/analyticsService.js';

async function getDashboard(_req, res, next) {
  try {
    const [metrics, domains, topSkills, salary] = await Promise.all([
      analyticsService.getDashboardMetrics(),
      analyticsService.getDomainDistribution(),
      analyticsService.getTopRequiredSkills(),
      analyticsService.getSalaryByLevel(),
    ]);
    res.json({
      success: true,
      data: { metrics, domains, topSkills, salary },
    });
  } catch (err) {
    next(err);
  }
}

async function getDomainDistribution(_req, res, next) {
  try {
    const data = await analyticsService.getDomainDistribution();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export { getDashboard, getDomainDistribution };

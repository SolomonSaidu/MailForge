import * as analyticsService from "../services/analytics.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Controller to fetch all dashboard analytics for the authenticated user.
 */
export const getDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Fetch stats and trends in parallel for performance
  const [stats, trends] = await Promise.all([
    analyticsService.getStats(userId),
    analyticsService.getDailyTrends(userId),
  ]);

  res.status(200).json({
    success: true,
    data: {
      stats,
      trends,
    },
  });
});

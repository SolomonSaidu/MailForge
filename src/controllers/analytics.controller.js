import * as analyticsService from "../services/analytics.service.js";

/**
 * Controller to fetch all dashboard analytics for the authenticated user.
 */
export const getDashboardData = async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Analytics Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics data",
    });
  }
};

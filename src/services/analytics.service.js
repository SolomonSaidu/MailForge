import prisma from "../config/db.js";

/**
 * Service to aggregate various usage statistics for a user.
 */
export const getStats = async (userId) => {
  // 1. Get counts by status (sent vs failed)
  const statusCounts = await prisma.emailLog.groupBy({
    by: ["status"],
    where: { userId },
    _count: {
      _all: true,
    },
  });

  // Transform the array into a friendly object
  const stats = {
    total: 0,
    sent: 0,
    failed: 0,
  };

  statusCounts.forEach((item) => {
    if (item.status === "sent") stats.sent = item._count._all;
    if (item.status === "failed") stats.failed = item._count._all;
    stats.total += item._count._all;
  });

  // 2. Count active API keys
  const activeKeysCount = await prisma.apiKey.count({
    where: {
      userId,
      revoked: false,
    },
  });

  return {
    overview: {
      ...stats,
      successRate: stats.total > 0 ? ((stats.sent / stats.total) * 100).toFixed(2) : 0,
    },
    activeKeys: activeKeysCount,
  };
};

/**
 * Service to get daily email trends for the last 7 days.
 */
export const getDailyTrends = async (userId) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const logs = await prisma.emailLog.findMany({
    where: {
      userId,
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    select: {
      createdAt: true,
      status: true,
    },
  });

  // Group by date in memory (for simplicity in v1)
  const trends = {};
  
  // Pre-fill last 7 days with 0s
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    trends[dateStr] = 0;
  }

  logs.forEach((log) => {
    const dateStr = log.createdAt.toISOString().split("T")[0];
    if (trends[dateStr] !== undefined) {
      trends[dateStr]++;
    }
  });

  // Convert to a sorted array
  return Object.keys(trends)
    .sort()
    .map((date) => ({
      date,
      count: trends[date],
    }));
};

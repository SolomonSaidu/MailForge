import pkg from "@prisma/client";
const { PrismaClient } = pkg;

// Prisma 7 will automatically look for prisma.config.js/ts
const prisma = new PrismaClient();

export default prisma;

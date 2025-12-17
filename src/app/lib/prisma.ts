import { db } from "../db";

// Export db as prisma to mock the client
export const prisma = db as any;

export default prisma;

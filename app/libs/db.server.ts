import { enhance } from "@zenstackhq/runtime";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export function getEnhancedPrisma(userId: string) {
  return enhance(prisma, { user: { id: userId } });
}

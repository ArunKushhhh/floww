"use server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getCredentialsForUser() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  return prisma.credentials.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
}

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { baseCategories } from "@/lib/sample-data";

export async function GET(_req: NextRequest) {
  try {
    const categories = await prisma.category.findMany({ orderBy: { key: "asc" } });
    if (categories.length === 0) {
      // If DB is empty, return fallback
      return Response.json(baseCategories);
    }
    return Response.json(categories.map((c) => ({ key: c.key, label: c.label })));
  } catch (err) {
    // Fallback to static sample when DB connection is not ready
    return Response.json(baseCategories, { status: 200 });
  }
}
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sampleParts } from "@/lib/sample-data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoryKey = searchParams.get("category");

  try {
    let parts = await prisma.part.findMany({
      include: { category: true },
      ...(categoryKey ? { where: { category: { key: categoryKey } } } : {}),
      orderBy: [{ categoryId: "asc" }, { name: "asc" }],
    });

    if (parts.length === 0) {
      // DB empty: return sample
      const src = categoryKey ? sampleParts.filter((p) => p.categoryKey === categoryKey) : sampleParts;
      return Response.json(src);
    }

    // Normalize to the shape the frontend expects
    const normalized = parts.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: p.price,
      watt: p.watt,
      details: p.details ?? undefined,
      categoryKey: p.category.key,
    }));

    return Response.json(normalized);
  } catch (err) {
    const src = categoryKey ? sampleParts.filter((p) => p.categoryKey === categoryKey) : sampleParts;
    return Response.json(src, { status: 200 });
  }
}
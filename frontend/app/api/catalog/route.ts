import { NextRequest, NextResponse } from "next/server";
import { gatewayFetch, ApiError } from "../../lib/api-client";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");
  const qs = category ? `?category=${encodeURIComponent(category)}` : "";

  try {
    const data = await gatewayFetch(`/api/v1/catalog/products${qs}`);
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

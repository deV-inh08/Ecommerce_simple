import { NextRequest, NextResponse } from "next/server";
import { gatewayFetch, ApiError } from "../../../../lib/api-client";

/** GET /api/inventory/items/:sku — inventory detail by SKU (public) */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ sku: string }> },
) {
  const { sku } = await params;

  try {
    const data = await gatewayFetch(`/api/v1/inventory/items/${sku}`);
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

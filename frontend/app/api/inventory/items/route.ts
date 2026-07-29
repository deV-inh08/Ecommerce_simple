import { NextResponse } from "next/server";
import { gatewayFetch, ApiError } from "../../../lib/api-client";

/** GET /api/inventory/items — list all inventory (public) */
export async function GET() {
  try {
    const data = await gatewayFetch("/api/v1/inventory/items");
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

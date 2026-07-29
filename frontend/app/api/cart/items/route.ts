import { NextRequest, NextResponse } from "next/server";
import { gatewayFetch, ApiError } from "../../../lib/api-client";

function getToken(req: NextRequest): string | null {
  return req.headers.get("Authorization")?.replace("Bearer ", "") ?? null;
}

/** POST /api/cart/items — add item to cart */
export async function POST(req: NextRequest) {
  const token = getToken(req);
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  try {
    const data = await gatewayFetch("/api/v1/cart/items", {
      method: "POST",
      body: JSON.stringify(body),
      token,
    });
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { gatewayFetch, ApiError } from "../../lib/api-client";

function getToken(req: NextRequest): string | null {
  return req.headers.get("Authorization")?.replace("Bearer ", "") ?? null;
}

/** GET /api/orders — list orders for current user */
export async function GET(req: NextRequest) {
  const token = getToken(req);
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const data = await gatewayFetch("/api/v1/orders", { token });
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

/** POST /api/orders — trigger checkout (creates order from cart, starts saga) */
export async function POST(req: NextRequest) {
  const token = getToken(req);
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const data = await gatewayFetch("/api/v1/orders/checkout", {
      method: "POST",
      body: JSON.stringify({}),
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

import { NextRequest, NextResponse } from "next/server";
import { gatewayFetch, ApiError } from "../../lib/api-client";

function getToken(req: NextRequest): string | null {
  return req.headers.get("Authorization")?.replace("Bearer ", "") ?? null;
}

/** GET /api/cart — view cart */
export async function GET(req: NextRequest) {
  const token = getToken(req);
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const data = await gatewayFetch("/api/v1/cart", { token });
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

/** DELETE /api/cart — clear entire cart */
export async function DELETE(req: NextRequest) {
  const token = getToken(req);
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    await gatewayFetch("/api/v1/cart", { method: "DELETE", token });
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

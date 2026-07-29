import { NextRequest, NextResponse } from "next/server";
import { gatewayFetch, ApiError } from "../../../lib/api-client";

function getToken(req: NextRequest): string | null {
  return req.headers.get("Authorization")?.replace("Bearer ", "") ?? null;
}

/** GET /api/orders/:id — order detail with status */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = getToken(req);
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const data = await gatewayFetch(`/api/v1/orders/${id}`, { token });
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

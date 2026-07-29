import { NextRequest, NextResponse } from "next/server";
import { gatewayFetch, ApiError } from "../../../../lib/api-client";

function getToken(req: NextRequest): string | null {
  return req.headers.get("Authorization")?.replace("Bearer ", "") ?? null;
}

/** PUT /api/cart/items/:productId — update quantity */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  const token = getToken(req);
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { productId } = await params;
  const body = await req.json(); // { quantity: number }

  try {
    const data = await gatewayFetch(`/api/v1/cart/items/${productId}`, {
      method: "PUT",
      body: JSON.stringify(body),
      token,
    });
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

/** DELETE /api/cart/items/:productId — remove item */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  const token = getToken(req);
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { productId } = await params;

  try {
    await gatewayFetch(`/api/v1/cart/items/${productId}`, {
      method: "DELETE",
      token,
    });
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

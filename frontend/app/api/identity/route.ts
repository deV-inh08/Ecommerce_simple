import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { gatewayFetch, ApiError } from "../../lib/api-client";

const BASE = "/api/v1/identity";

export async function POST(req: NextRequest) {
  const action = req.nextUrl.searchParams.get("action");
  const body = await req.json().catch(() => ({}));

  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  try {
    switch (action) {
      case "login": {
        const data = await gatewayFetch<{
          accessToken: string;
          refreshToken: string;
          expiresIn: number;
        }>(`${BASE}/login`, { method: "POST", body: JSON.stringify(body) });

        const res = NextResponse.json({
          accessToken: data.accessToken,
          expiresIn: data.expiresIn,
        });
        // Store refreshToken in httpOnly cookie (7 days)
        res.cookies.set("refreshToken", data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });
        return res;
      }

      case "register": {
        const data = await gatewayFetch<{
          accessToken: string;
          refreshToken: string;
          expiresIn: number;
        }>(`${BASE}/register`, { method: "POST", body: JSON.stringify(body) });

        const res = NextResponse.json({
          accessToken: data.accessToken,
          expiresIn: data.expiresIn,
        });
        res.cookies.set("refreshToken", data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });
        return res;
      }

      case "refresh": {
        if (!refreshToken) {
          return NextResponse.json({ message: "No refresh token" }, { status: 401 });
        }
        const data = await gatewayFetch<{
          accessToken: string;
          refreshToken: string;
          expiresIn: number;
        }>(`${BASE}/refresh`, {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        });

        const res = NextResponse.json({
          accessToken: data.accessToken,
          expiresIn: data.expiresIn,
        });
        res.cookies.set("refreshToken", data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });
        return res;
      }

      case "logout": {
        await gatewayFetch(`${BASE}/logout`, {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        }).catch(() => {
          // Even if backend fails, we clear the cookie
        });

        const res = NextResponse.json({ ok: true });
        res.cookies.delete("refreshToken");
        return res;
      }

      default:
        return NextResponse.json({ message: "Unknown action" }, { status: 400 });
    }
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

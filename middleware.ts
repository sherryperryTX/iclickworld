import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Gates everything under /agent behind a logged-in + approved app_users row
// with role = 'agent' (or higher). Unapproved or logged-out visitors are
// bounced to /agent-login.
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!request.nextUrl.pathname.startsWith("/agent")) {
    return response;
  }

  if (!user) {
    const loginUrl = new URL("/agent-login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile } = await supabase
    .from("app_users")
    .select("role, is_approved")
    .eq("id", user.id)
    .single();

  const allowedRoles = ["agent", "admin", "super_admin"];
  if (!profile || !profile.is_approved || !allowedRoles.includes(profile.role)) {
    const pendingUrl = new URL("/agent-login", request.url);
    pendingUrl.searchParams.set("pending", "1");
    return NextResponse.redirect(pendingUrl);
  }

  return response;
}

export const config = {
  matcher: ["/agent/:path*"],
};

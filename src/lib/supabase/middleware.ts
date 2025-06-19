import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
export async function updateSession(
  request: NextRequest,
  response: NextResponse
) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Check if the pathname starts with a locale
  const segments = pathname.split("/");
  const potentialLocale = segments[1];
  const isLocale = routing.locales.includes(
    potentialLocale as (typeof routing.locales)[number]
  );
  const pathWithoutLocale = isLocale
    ? "/" + segments.slice(2).join("/")
    : pathname;

  // Check if the path is public
  // (i.e., does not require authentication)
  const isPublicPath =
    pathWithoutLocale === "/" ||
    pathWithoutLocale.startsWith("/auth") ||
    pathWithoutLocale.startsWith("/login");

  // If the user is not authenticated and the path is not public,
  // redirect them to the login page.
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = isLocale ? `/${potentialLocale}/auth/login` : "/auth/login";
    url.searchParams.set("redirectTo", pathname); // set the redirect path
    return NextResponse.redirect(url);
  }

  // If the user is authenticated and the path is public,
  const isAdminPath = pathWithoutLocale.startsWith("/admin-dashboard");

  if (user && isAdminPath) {
    // Check if the user has the 'admin' role
    const { data: rolesData, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    // If the user does not have the 'admin' role, redirect them to the home page
    if (error || rolesData?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = isLocale ? `/${potentialLocale}/` : "/";
      return NextResponse.redirect(url);
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return response;
}

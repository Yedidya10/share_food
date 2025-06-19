import createMiddleware from "next-intl/middleware";
import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const response = handleI18nRouting(request);

  // A `response` can now be passed here
  return await updateSession(request, response);
}

export const config = {
  /*
  // Match all pathnames except:
  // - … if they end with locale (e.g. `/en`, `/de`)
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
  matcher: [
    "/",
    "/(he|en)(/(?!api|trpc|_next|_vercel|.*\\..*).*)?",
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
  ],
};

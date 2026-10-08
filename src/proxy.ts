import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const LOGIN = "/admin/giris";

/**
 * Yalnızca `/admin/*`: Supabase oturumunu tazeler ve iyimser yönlendirme
 * yapar. Asıl yetki kontrolü burada DEĞİL — her sayfa/action'da
 * `requireAdmin()` ve veritabanında RLS.
 */
export async function proxy(request: NextRequest) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return NextResponse.next();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        for (const { name, value } of toSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of toSet) response.cookies.set(name, value, options);
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims.sub);
  const path = request.nextUrl.pathname.replace(/\/$/, "");
  const onLogin = path === LOGIN;

  if (!signedIn && !onLogin) return redirectKeepingCookies(to(request, LOGIN), response);
  if (signedIn && onLogin && !request.nextUrl.searchParams.has("hata")) {
    return redirectKeepingCookies(to(request, "/admin"), response);
  }
  return response;
}

function to(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  return url;
}

/** Tazelenen oturum çerezleri yönlendirmede kaybolmasın. */
function redirectKeepingCookies(url: URL, from: NextResponse) {
  const redirect = NextResponse.redirect(url);
  for (const cookie of from.cookies.getAll()) redirect.cookies.set(cookie);
  return redirect;
}

export const config = {
  matcher: ["/admin", "/admin/((?!manifest\\.webmanifest).*)"],
};

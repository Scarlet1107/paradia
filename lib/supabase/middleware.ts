import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });
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
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();

  if (
    request.nextUrl.pathname !== "/" &&
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    // ログインしていない場合、ログインページにリダイレクト
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }
  // ログインしている場合、protectedページ以外を許可しない
  else if (user) {
    const date = new Date();
    const { data: userData, error } = await supabase
      .from("profiles")
      .select("trust_score")
      .eq("id", user.id)
      .single();

    // trust_scoreが0以下の場合、delete_userページにリダイレクト// サーバーログに出力
    if (
      !request.nextUrl.pathname.startsWith("/protected/delete-user") &&
      !error &&
      userData &&
      userData.trust_score <= 0
    ) {
      url.pathname = "/protected/delete-user";
      return NextResponse.redirect(url);
    }
    // trust_scoreが1以上かつ、delete_userにアクセスした場合/protected/homeに戻す
    else if (
      !request.nextUrl.pathname.startsWith("/protected") ||
      (userData &&
        userData.trust_score >= 1 &&
        request.nextUrl.pathname.startsWith("/protected/delete-user"))
    ) {
      url.pathname = "/protected/home";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

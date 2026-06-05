import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Protege /admin/painel/* — só usuários autenticados entram.
// A página /admin (login) fica liberada.
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected = pathname.startsWith("/admin/painel");
  if (isProtected && !req.auth) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/admin/painel/:path*"],
};

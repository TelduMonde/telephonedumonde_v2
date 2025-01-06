import { NextResponse } from "next/server";

// import authConfig from "./auth.config";
// import NextAuth from "next-auth";

// import {
//   DEFAULT_LOGIN_REDIRECT,
//   apiAuthPrefix,
//   publicRoutes,
//   authRoutes,
//   adminRoutes,
//   apiUploadPrefix,
// } from "./route";
import { currentUser } from "./lib/auth";

// Fonction pour vérifier si une route est publique
// function isPublicRoute(pathname: string) {
//   return publicRoutes.some((route) => pathname.startsWith(route));
// }

export default async function middleware(request: Request) {
  //! Obtenir la session de l'utilisateur
  const session = await currentUser();

  //! Obtenir les routes sur lesquelles le user navigue
  const { pathname } = new URL(request.url);

  if (session) {
    //! Vérifier si l'utilisateur est connecté et tente d'accéder à une route d'authentification
    if (
      pathname.startsWith("/se-connecter") ||
      pathname.startsWith("/creer-mon-compte")
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    //! Vérifier si l'utilisateur n'est pas admin et tente d'accéder à une route admin
    if (
      pathname.startsWith("/admin-tel-du-monde") &&
      session.role !== "admin"
    ) {
      return NextResponse.redirect(new URL("/not-found", request.url));
    }
  } else {
    //! Vérifier si l'utilisateur n'est pas connecté et tente d'accéder à une route privée
    if (
      pathname.startsWith("/admin-tel-du-monde") ||
      pathname.startsWith("/mon-compte")
    ) {
      return NextResponse.redirect(new URL("/not-found", request.url));
    }
  }

  // // Vérifier si la route est publique
  // if (isPublicRoute(pathname)) {
  //   return NextResponse.next();
  // }

  // // 1. Vérifier si la route est une route publique
  // if (isPublicRoute(pathname)) {
  //   return NextResponse.next();
  // }

  // // 2. Vérifier si la route est une route d'authentification
  // if (authRoutes.includes(pathname)) {
  //   if (isLoggedIn) {
  //     // Rediriger les utilisateurs connectés qui tentent d'accéder aux routes d'authentification
  //     return NextResponse.redirect(new URL("/mon-compte", req.url));
  //   }
  //   return NextResponse.next();
  // }

  // // 3. Rediriger les utilisateurs non connectés pour les routes privées
  // if (!isLoggedIn) {
  //   return NextResponse.redirect(new URL("/se-connecter", req.url));
  // }

  // // 4. Vérifier si la route est une route administrateur
  // if (adminRoutes.includes(pathname)) {
  //   if (token?.role !== "admin") {
  //     // Rediriger un utilisateur non administrateur
  //     return NextResponse.redirect(new URL("/", req.url));
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

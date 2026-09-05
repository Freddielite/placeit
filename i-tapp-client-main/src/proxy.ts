import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "./utils";

const roleRedirects: Record<string, string> = {
  student: "/portal/find-it-space",
  company: "/portal/dashboard",
  corps: "/portal/find-ppa",
  admin: "/admin",
};

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_BACKEND_API_URL;

if (!API_BASE_URL) {
  console.warn(
    "⚠️ WARNING: NEXT_PUBLIC_APP_BACKEND_API_URL is not set. API calls will fail.",
  );
  process.exit(1);
}

async function me(token: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "G-PlaceIT-build": process.env.NEXT_PUBLIC_BUILD_KEY ?? "",
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const skipStudentOnboarding =
    req.cookies.get("skip-student-onboarding")?.value === "true";
  const skipCompanyOnboarding =
    req.cookies.get("skip-company-onboarding")?.value === "true";
  // do for email verification routes later
  const token = req.cookies.get("session-token")?.value; // || "fake-token";
  const role = req.cookies.get("role")?.value; // || "admin";
  const { pathname } = req.nextUrl;

  const isCompanyRole = role === "company";
  const isStudentRole = role === "student";
  const isCorpsRole = role === "corps";

  const isCompanyOnboardingRoute = pathname.startsWith("/portal/onboarding");
  const isStudentOnboardingRoute = pathname.startsWith("/portal/onboarding");
  // do for email verification routes later
  const isAdminRoute = pathname.startsWith("/admin");
  const isProfileRoute = pathname.startsWith("/portal/profile");
  const isPortalRoute = pathname.startsWith("/portal");
  const isAuthRoute = [
    "/signin",
    "/signup",
    "/company/signin",
    "/company/signup",
    "/corps/signup",
    "/auth",
  ].includes(pathname);

  // Case 0: Token but no role → reset cookies and force re-login
  if (token && !role) {
    const response = NextResponse.redirect(new URL("/signin", req.url));
    response.cookies.delete("session-token");
    response.cookies.delete("role");
    response.cookies.delete("company-onboarded");
    return response;
  }

  if (isAdminRoute) {
    if (!token || role !== "admin") {
      return NextResponse.redirect(new URL("/auth", req.url));
    }
    const response = NextResponse.next();
    if (role) response.headers.set("x-user-role", role);
    return response;
  }

  if (pathname === "/portal") {
    if (!token) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    if (role && roleRedirects[role]) {
      return NextResponse.redirect(new URL(roleRedirects[role], req.url));
    }
  }

  if (isPortalRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    const profile = await me(token);

    if (!profile) {
      const response = NextResponse.redirect(new URL("/signin", req.url));

      response.cookies.delete("session-token");
      response.cookies.delete("role");
      response.cookies.delete("company-onboarded");
      response.cookies.delete("skip-student-onboarding");
      response.cookies.delete("skip-company-onboarding");

      return response;
    }

    // console.log("Profile:", profile);

    // const role = profile?.role; // "student" | "company" | "admin"
    // const company = profile?.company;
    // const student = profile?.student;
    const companyOnboarded = profile?.company?.isOnboarded === true; // boolean
    const studentOnboarded = profile?.student?.isOnboarded === true; // boolean
    const corpsOnboarded = profile?.corps?.isOnboarded === true; // boolean

    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (isCompanyRole) {
      const canSkip = companyOnboarded || skipCompanyOnboarding;

      if (canSkip && isCompanyOnboardingRoute) {
        return NextResponse.redirect(new URL("/portal/dashboard", req.url));
      }

      // && !isProfileRoute

      if (!canSkip && !isCompanyOnboardingRoute) {
        return NextResponse.redirect(new URL("/portal/onboarding/", req.url));
      }
    }

    if (isStudentRole) {
      const canSkip = studentOnboarded || skipStudentOnboarding;

      if (canSkip && isStudentOnboardingRoute) {
        return NextResponse.redirect(new URL("/portal/find-it-space", req.url));
      }

      if (!canSkip && !isStudentOnboardingRoute) {
        return NextResponse.redirect(new URL("/portal/onboarding/", req.url));
      }
    }

    if (isCorpsRole) {
      const isCorpsOnboardingRoute = pathname.startsWith("/portal/onboarding");
      if (corpsOnboarded && isCorpsOnboardingRoute) {
        return NextResponse.redirect(new URL("/portal/find-ppa", req.url));
      }
      if (!corpsOnboarded && !isCorpsOnboardingRoute) {
        return NextResponse.redirect(new URL("/portal/onboarding/", req.url));
      }
    }

    const response = NextResponse.next();
    if (role) response.headers.set("x-user-role", role);
    return response;
  }

  if (isAuthRoute && token) {
    if (role && roleRedirects[role]) {
      return NextResponse.redirect(new URL(roleRedirects[role], req.url));
    }
  }

  const response = NextResponse.next();
  if (role) response.headers.set("x-user-role", role);
  return response;
}

export const config = {
  matcher: [
    "/portal/:path*",
    "/admin/:path*",
    "/signin",
    "/signup",
    "/company/:path*",
    "/auth",
  ],
};

// // middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { env } from "./utils";

// const roleRedirects: Record<string, string> = {
//   student: "/portal/find-it-space",
//   company: "/portal/dashboard",
//   admin: "/admin",
// };

// const API_BASE_URL = process.env.NEXT_PUBLIC_APP_BACKEND_API_URL;

// async function me(token: string) {
//   const response = await fetch(`${API_BASE_URL}/auth/me`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!response.ok) {
//     console.error("Failed to fetch profile:", response.statusText);
//     return null;
//   }
//   return response.json();
// }

// export async function proxy(req: NextRequest) {
//   const skipStudentOnboarding =
//     req.cookies.get("skip-student-onboarding")?.value === "true";
//   const skipCompanyOnboarding =
//     req.cookies.get("skip-company-onboarding")?.value === "true";
//   const token = req.cookies.get("session-token")?.value;
//   const role = req.cookies.get("role")?.value;
//   const { pathname } = req.nextUrl;

//   const isCompanyRole = role === "company";
//   const isStudentRole = role === "student";

//   const isCompanyOnboardingRoute = pathname.startsWith("/portal/onboarding");
//   const isStudentOnboardingRoute = pathname.startsWith("/portal/onboarding");
//   const isAdminRoute = pathname.startsWith("/admin");
//   const isProfileRoute = pathname.startsWith("/portal/profile");
//   const isPortalRoute = pathname.startsWith("/portal");
//   const isAuthRoute = [
//     "/signin",
//     "/signup",
//     "/company/signin",
//     "/company/signup",
//     "/auth",
//   ].includes(pathname);

//   // Case 0: Token but no role → reset cookies and force re-login
//   if (token && !role) {
//     const response = NextResponse.redirect(new URL("/signin", req.url));
//     response.cookies.delete("session-token");
//     response.cookies.delete("role");
//     response.cookies.delete("company-onboarded");
//     return response;
//   }

//   // TEMPORARY: BYPASS ADMIN AUTH FOR LOCAL DEVELOPMENT
//   // REMOVE THIS BEFORE DEPLOYING!!!
//   if (isAdminRoute) {
//     console.log("⚠️ BYPASSING ADMIN AUTH - LOCAL DEV MODE");
//     const response = NextResponse.next();
//     response.headers.set("x-user-role", "admin");
//     return response;
//   }

//   /* ORIGINAL ADMIN AUTH - UNCOMMENT WHEN BACKEND IS RUNNING
//   if (isAdminRoute) {
//     if (!token || role !== "admin") {
//       return NextResponse.redirect(new URL("/auth", req.url));
//     }
//     const response = NextResponse.next();
//     if (role) response.headers.set("x-user-role", role);
//     return response;
//   }
//   */

//   if (pathname === "/portal") {
//     if (!token) {
//       return NextResponse.redirect(new URL("/signin", req.url));
//     }

//     if (role && roleRedirects[role]) {
//       return NextResponse.redirect(new URL(roleRedirects[role], req.url));
//     }
//   }

//   if (isPortalRoute) {
//     if (!token) {
//       return NextResponse.redirect(new URL("/signin", req.url));
//     }

//     const profile = await me(token);

//     const companyOnboarded = profile?.company?.isOnboarded === true;
//     const studentOnboarded = profile?.student?.isOnboarded === true;

//     if (role === "admin") {
//       return NextResponse.redirect(new URL("/admin", req.url));
//     }

//     if (isCompanyRole) {
//       const canSkip = companyOnboarded || skipCompanyOnboarding;

//       if (canSkip && isCompanyOnboardingRoute) {
//         return NextResponse.redirect(new URL("/portal/dashboard", req.url));
//       }

//       if (!canSkip && !isCompanyOnboardingRoute) {
//         return NextResponse.redirect(new URL("/portal/onboarding/", req.url));
//       }
//     }

//     if (isStudentRole) {
//       const canSkip = studentOnboarded || skipStudentOnboarding;

//       if (canSkip && isStudentOnboardingRoute) {
//         return NextResponse.redirect(new URL("/portal/find-it-space", req.url));
//       }

//       if (!canSkip && !isStudentOnboardingRoute) {
//         return NextResponse.redirect(new URL("/portal/onboarding/", req.url));
//       }
//     }

//     const response = NextResponse.next();
//     if (role) response.headers.set("x-user-role", role);
//     return response;
//   }

//   if (isAuthRoute && token) {
//     if (role && roleRedirects[role]) {
//       return NextResponse.redirect(new URL(roleRedirects[role], req.url));
//     }
//   }

//   const response = NextResponse.next();
//   if (role) response.headers.set("x-user-role", role);
//   return response;
// }

// export const config = {
//   matcher: [
//     "/portal/:path*",
//     "/admin/:path*",
//     "/signin",
//     "/signup",
//     "/company/:path*",
//     "/auth",
//   ],
// };

import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Analytics } from "@vercel/analytics/next";
import { AppProvider } from "@/components/providers/app-provider";
import { ReactQueryProvider } from "@/provider/react-query-provider";
import { app } from "@/config/app";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";

export const montserrat = Montserrat({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const opensans = Open_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-opensans",
  display: "swap",
});
const siteUrl = "https://www.getplaceit.com";

// Ships the *web* viewport: pinch-zoom allowed (WCAG 1.4.4, and Lighthouse
// penalises `user-scalable=no`). AppShellEffects rewrites this tag to the
// locked-down app viewport at runtime, but only when running as the
// installed app. See `disableZoom` in src/config/app-features.ts.
export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#477dc0",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: app.title,
    template: `%s | ${app.name}`,
  },
  description: app.description,

  alternates: {
    canonical: "/",
  },

  authors: [{ name: "PlaceIT" }],

  keywords: [
    "i-tapp",
    "itapp",
    "PlaceIT",
    "ITAPP",
    "SIWES placement",
    "industrial training placement",
    "IT placement Nigeria",
    "internship placement Nigeria",
    "student industrial work experience scheme",
    "SIWES companies Nigeria",
    "find SIWES placement",
    "apply for SIWES",
    "Nigerian students internship",
    "industrial training portal Nigeria",
  ],

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: app.favicon_url,
    apple: [{ url: "/apple-touch-icon.png" }],
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: app.name,
  },

  openGraph: {
    siteName: app.name,
    title: app.title,
    description: app.description,
    type: "website",
    locale: "en_NG",
    images: [
      {
        url: new URL("/placeholder.jpg", siteUrl).toString(),
        width: 1200,
        height: 630,
        alt: app.title,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: app.title,
    description: app.description,
    images: [new URL("/placeholder.jpg", siteUrl).toString()],
  },

  verification: {
    google: [
      "SgVK8kUBhOUn5GdrmUT4m1-HtKsHDcNW9AHWdqJ-GSo",
      "ca-pub-2231106094660297",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the boot script adds mode and theme classes
    // to <html> before React hydrates, so the server markup never matches.
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-2231106094660297" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1YSPPC5H7Z"
          strategy="afterInteractive"
        />
        <Script id="ga4" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1YSPPC5H7Z');
          `}
        </Script>
        <Script
          id="website-structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "PlaceIT",
              alternateName: ["PlaceIT", "PlacementHub", "i-tapp", "itapp"],
              url: siteUrl,
              potentialAction: {
                "@type": "SearchAction",
                target: `${siteUrl}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          id="app-boot-detect"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                // Runs before first paint. Mirrors src/lib/app-mode.ts -
                // keep the two in sync. Everything app-exclusive is gated
                // on the classes set here, so the website never renders a
                // frame of app chrome and vice versa.
                var root = document.documentElement;
                try {
                  // UA marker first - the Capacitor bridge may not be
                  // injected yet on a remotely-loaded page. See
                  // NATIVE_UA_MARKER in src/lib/app-mode.ts.
                  var isNative = navigator.userAgent.indexOf("PlaceItApp") !== -1
                    || !!(window.Capacitor && typeof window.Capacitor.isNativePlatform === "function" && window.Capacitor.isNativePlatform());

                  var standalone = false;
                  if (window.matchMedia) {
                    var modes = ["standalone", "fullscreen", "minimal-ui"];
                    for (var i = 0; i < modes.length; i++) {
                      if (window.matchMedia("(display-mode: " + modes[i] + ")").matches) { standalone = true; break; }
                    }
                  }
                  if (window.navigator.standalone === true) standalone = true;
                  if (document.referrer.indexOf("android-app://") === 0) standalone = true;

                  var forced = false;
                  try {
                    var q = new URLSearchParams(window.location.search).get("appmode");
                    if (q === "1" || q === "true") { sessionStorage.setItem("placeit:force-app-mode", "1"); }
                    else if (q === "0" || q === "false") { sessionStorage.removeItem("placeit:force-app-mode"); }
                    forced = sessionStorage.getItem("placeit:force-app-mode") === "1";
                  } catch (e) {}

                  var isApp = isNative || standalone || forced;

                  root.classList.add(isApp ? "is-app-mode" : "is-browser-mode");
                  if (isNative) root.classList.add("is-native-app");

                  // Theme, resolved in the same pass so there is never a
                  // light frame before a dark one. Dark mode is app-only, so
                  // the website skips this entirely and stays light.
                  if (isApp) {
                    var pref = null;
                    try { pref = localStorage.getItem("placeit:theme"); } catch (e) {}
                    if (pref !== "light" && pref !== "dark") pref = "system";
                    var dark = pref === "dark" || (pref === "system"
                      && window.matchMedia
                      && window.matchMedia("(prefers-color-scheme: dark)").matches);
                    if (dark) {
                      root.classList.add("dark");
                      root.style.colorScheme = "dark";
                    }
                  }

                  if (isApp) {
                    // Hide content until the splash overlay is mounted.
                    root.classList.add("app-boot");
                    setTimeout(function () {
                      root.classList.remove("app-boot");
                    }, 4000);
                  }
                } catch (e) {
                  // Never leave the page invisible if detection throws.
                  root.classList.add("is-browser-mode");
                  root.classList.remove("app-boot");
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${opensans.variable} ${montserrat.variable} antialiased`} suppressHydrationWarning={true}
      >
        <ReactQueryProvider>
          <AppProvider>
            {/* <Suspense fallback={<Loading />}> */}
            {children}
            {/* </Suspense> */}
          </AppProvider>
        </ReactQueryProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

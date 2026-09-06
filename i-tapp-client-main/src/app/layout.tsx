import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Analytics } from "@vercel/analytics/next";
import { AppProvider } from "@/components/providers/app-provider";
import { ReactQueryProvider } from "@/provider/react-query-provider";
import { ToastContainer } from "react-toastify";
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

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
    <html lang="en">
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
        <Script
          id="app-boot-detect"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var isNativeApp = window.Capacitor && typeof window.Capacitor.isNativePlatform === "function" && window.Capacitor.isNativePlatform();
                  var isInstalledPwa = window.matchMedia && window.matchMedia("(display-mode: standalone)").matches;
                  if (isNativeApp || isInstalledPwa) {
                    document.documentElement.classList.add("app-boot");
                    // Failsafe: if React never mounts for any reason (JS error,
                    // slow network), don't leave the page permanently blank.
                    setTimeout(function () {
                      document.documentElement.classList.remove("app-boot");
                    }, 4000);
                  }
                } catch (e) {}
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
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

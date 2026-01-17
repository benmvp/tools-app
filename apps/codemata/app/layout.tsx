import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { SITE_CONFIG } from "@/lib/site-config";
import { getAppUrl } from "@/lib/utils";
import { LayoutContent } from "./layout-content";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getAppUrl()),
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [...SITE_CONFIG.keywords],
  authors: [{ name: SITE_CONFIG.author.name, url: SITE_CONFIG.author.url }],
  creator: SITE_CONFIG.author.name,
  publisher: SITE_CONFIG.name,
  openGraph: {
    type: SITE_CONFIG.openGraph.type,
    locale: SITE_CONFIG.openGraph.locale,
    url: getAppUrl(),
    siteName: SITE_CONFIG.openGraph.siteName,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.openGraph.images],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    creator: SITE_CONFIG.author.twitter,
    images: [SITE_CONFIG.openGraph.images.url],
  },
  robots: SITE_CONFIG.robots,
};

const GOOGLE_ANALYTICS_SCRIPT_TAG_ID = "google-analytics";
const GOOGLE_ADSENSE_SCRIPT_TAG_ID = "google-adsense";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const adsenseClientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script
              id={GOOGLE_ANALYTICS_SCRIPT_TAG_ID}
              strategy="afterInteractive"
            >
              {`
            // Only load GA if not on localhost
            if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            } else {
              console.log('Google Analytics disabled on localhost');
            }
          `}
            </Script>
          </>
        )}
        {/* Google Adsense */}
        {adsenseClientId && (
          <Script
            id={GOOGLE_ADSENSE_SCRIPT_TAG_ID}
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}

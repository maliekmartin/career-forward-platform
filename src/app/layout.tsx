import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/lib/theme-context";
import { PreviewOverlay } from "@/components/preview-overlay";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Career Forward | Here To Move You Forward",
  description: "Land your dream job faster with Career Forward. Free AI-powered resume builder, job tracker, interview prep, and career coaching. Your complete job search command center.",
  keywords: ["job search", "resume builder", "career coaching", "job tracker", "interview prep", "employment", "workforce development", "AI career coach", "job application tracker"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Career Forward",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://careerforward.io",
    siteName: "Career Forward",
    title: "Career Forward | Here To Move You Forward",
    description: "Land your dream job faster with Career Forward. Free AI-powered resume builder, job tracker, interview prep, and career coaching tools.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Career Forward - Here To Move You Forward",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Forward | Here To Move You Forward",
    description: "Land your dream job faster. Free AI-powered resume builder, job tracker, and career coaching.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="Career Forward" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Career Forward" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#0F172A" />
        <link rel="apple-touch-icon" href="/career-forward-icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <PreviewOverlay>
            {children}
          </PreviewOverlay>
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful');
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

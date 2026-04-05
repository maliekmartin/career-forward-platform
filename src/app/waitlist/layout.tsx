import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join the Waitlist | Career Forward - Here To Move You Forward",
  description: "Be first in line for Career Forward's beta launch. Get early access to free AI-powered job search tools, resume builder, and career coaching. Join thousands of job seekers moving forward.",
  keywords: ["career forward waitlist", "job search tools", "free resume builder", "career coaching", "beta access", "job tracker"],
  openGraph: {
    title: "Join the Career Forward Waitlist",
    description: "Be first in line for free AI-powered job search tools. Land your dream job faster with our resume builder, job tracker, and career coaching.",
    url: "https://careerforward.io/waitlist",
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
    title: "Join the Career Forward Waitlist",
    description: "Be first in line for free AI-powered job search tools. Land your dream job faster.",
    images: ["/og-image.png"],
  },
};

export default function WaitlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("STRIPE_SECRET_KEY is not set - Stripe functionality will be disabled");
}

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-12-18.acacia",
      typescript: true,
    })
  : null;

export const PREMIUM_PRICE_ID = process.env.STRIPE_PRICE_ID || "";

export const SUBSCRIPTION_PLANS = {
  PREMIUM: {
    name: "Career Forward Premium",
    price: 4.99,
    interval: "month" as const,
    features: [
      "View your Resume Quality Score breakdown",
      "View your Job Seeker Score breakdown",
      "Personalized recommendations to improve scores",
      "AI Career Coach access",
      "Labor market insights for your industry",
      "Track score improvements over time",
    ],
  },
};

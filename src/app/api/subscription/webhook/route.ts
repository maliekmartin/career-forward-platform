import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { sendPaymentFailedEmail, sendSubscriptionCanceledEmail } from "@/lib/services/email-service";

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    );
  }

  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const subscriptionId = session.subscription as string;

        if (userId && subscriptionId) {
          // Get subscription details
          const subscription = await stripe.subscriptions.retrieve(subscriptionId) as Stripe.Subscription;

          await prisma.user.update({
            where: { id: userId },
            data: {
              subscriptionTier: "PREMIUM",
              subscriptionStatus: subscription.status,
              stripeSubscriptionId: subscriptionId,
              subscriptionStartDate: new Date((subscription as unknown as { current_period_start: number }).current_period_start * 1000),
              subscriptionEndDate: new Date((subscription as unknown as { current_period_end: number }).current_period_end * 1000),
            },
          });

          console.log(`User ${userId} subscribed to Premium`);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: subscription.status,
              subscriptionEndDate: new Date((subscription as unknown as { current_period_end: number }).current_period_end * 1000),
            },
          });

          console.log(`Subscription updated for user ${user.id}: ${subscription.status}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
          include: { profile: true },
        });

        if (user) {
          // Get the end date before updating
          const endDate = user.subscriptionEndDate || new Date();

          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionTier: "FREE",
              subscriptionStatus: "canceled",
              stripeSubscriptionId: null,
            },
          });

          // Send subscription canceled notification email
          const firstName = user.profile?.firstName || undefined;

          try {
            const emailResult = await sendSubscriptionCanceledEmail(
              user.email,
              firstName,
              endDate
            );
            if (emailResult.success) {
              console.log(`Subscription canceled email sent to user ${user.id}`);
            } else {
              console.error(`Failed to send subscription canceled email: ${emailResult.error}`);
            }
          } catch (emailError) {
            console.error("Error sending subscription canceled email:", emailError);
          }

          console.log(`Subscription canceled for user ${user.id}`);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
          include: { profile: true },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: "past_due",
            },
          });

          // Send payment failure notification email
          const attemptCount = invoice.attempt_count || 1;
          const firstName = user.profile?.firstName || undefined;

          try {
            const emailResult = await sendPaymentFailedEmail(
              user.email,
              firstName,
              attemptCount
            );
            if (emailResult.success) {
              console.log(`Payment failure email sent to user ${user.id}`);
            } else {
              console.error(`Failed to send payment failure email: ${emailResult.error}`);
            }
          } catch (emailError) {
            console.error("Error sending payment failure email:", emailError);
          }

          console.log(`Payment failed for user ${user.id} (attempt ${attemptCount})`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

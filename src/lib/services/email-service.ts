import { Resend } from "resend";

// Lazy initialization to avoid issues at import time
let resend: Resend | null = null;

function getResend(): Resend {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

const FROM_EMAIL = process.env.EMAIL_FROM || "Career Forward <noreply@careerforward.com>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send email verification link to new user
 */
export async function sendVerificationEmail(
  email: string,
  token: string,
  firstName?: string
): Promise<SendEmailResult> {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`;
  const name = firstName || "there";

  try {
    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Verify your Career Forward account",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #0d9488; margin: 0;">Career Forward</h1>
  </div>

  <h2 style="color: #1f2937;">Hey ${name}! 👋</h2>

  <p>Welcome to Career Forward! We're excited to help you on your career journey.</p>

  <p>Please verify your email address by clicking the button below:</p>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${verifyUrl}" style="background-color: #0d9488; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
      Verify My Email
    </a>
  </div>

  <p style="color: #6b7280; font-size: 14px;">
    Or copy and paste this link into your browser:<br>
    <a href="${verifyUrl}" style="color: #0d9488; word-break: break-all;">${verifyUrl}</a>
  </p>

  <p style="color: #6b7280; font-size: 14px;">
    This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
  </p>

  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

  <p style="color: #9ca3af; font-size: 12px; text-align: center;">
    Career Forward - Your pathway to career success<br>
    © ${new Date().getFullYear()} Career Forward. All rights reserved.
  </p>
</body>
</html>
      `,
      text: `
Hey ${name}!

Welcome to Career Forward! We're excited to help you on your career journey.

Please verify your email address by visiting this link:
${verifyUrl}

This link will expire in 24 hours.

If you didn't create an account, you can safely ignore this email.

- The Career Forward Team
      `.trim(),
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Email send error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  token: string,
  firstName?: string
): Promise<SendEmailResult> {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;
  const name = firstName || "there";

  try {
    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Reset your Career Forward password",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #0d9488; margin: 0;">Career Forward</h1>
  </div>

  <h2 style="color: #1f2937;">Password Reset Request</h2>

  <p>Hey ${name},</p>

  <p>We received a request to reset your password. Click the button below to create a new password:</p>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${resetUrl}" style="background-color: #0d9488; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
      Reset Password
    </a>
  </div>

  <p style="color: #6b7280; font-size: 14px;">
    Or copy and paste this link into your browser:<br>
    <a href="${resetUrl}" style="color: #0d9488; word-break: break-all;">${resetUrl}</a>
  </p>

  <p style="color: #6b7280; font-size: 14px;">
    This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email - your password won't be changed.
  </p>

  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

  <p style="color: #9ca3af; font-size: 12px; text-align: center;">
    Career Forward - Your pathway to career success<br>
    © ${new Date().getFullYear()} Career Forward. All rights reserved.
  </p>
</body>
</html>
      `,
      text: `
Hey ${name},

We received a request to reset your password. Visit this link to create a new password:
${resetUrl}

This link will expire in 1 hour.

If you didn't request a password reset, you can safely ignore this email.

- The Career Forward Team
      `.trim(),
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Email send error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}

/**
 * Send welcome email after verification
 */
export async function sendWelcomeEmail(
  email: string,
  firstName?: string
): Promise<SendEmailResult> {
  const dashboardUrl = `${APP_URL}/dashboard`;
  const name = firstName || "there";

  try {
    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Welcome to Career Forward! 🎉",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #0d9488; margin: 0;">Career Forward</h1>
  </div>

  <h2 style="color: #1f2937;">You're all set, ${name}! 🎉</h2>

  <p>Your email has been verified and your Career Forward account is ready to go.</p>

  <p>Here's what you can do next:</p>

  <ul style="color: #4b5563;">
    <li><strong>Complete your profile</strong> - Help us personalize your experience</li>
    <li><strong>Upload your resume</strong> - Get your Career Forward score</li>
    <li><strong>Explore the pathway</strong> - 5 stages to career success</li>
    <li><strong>Chat with Compass</strong> - Your AI career coach</li>
  </ul>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${dashboardUrl}" style="background-color: #0d9488; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
      Go to Dashboard
    </a>
  </div>

  <p>If you have any questions, our AI coach Compass is always here to help!</p>

  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

  <p style="color: #9ca3af; font-size: 12px; text-align: center;">
    Career Forward - Your pathway to career success<br>
    © ${new Date().getFullYear()} Career Forward. All rights reserved.
  </p>
</body>
</html>
      `,
      text: `
You're all set, ${name}! 🎉

Your email has been verified and your Career Forward account is ready to go.

Here's what you can do next:
- Complete your profile - Help us personalize your experience
- Upload your resume - Get your Career Forward score
- Explore the pathway - 5 stages to career success
- Chat with Compass - Your AI career coach

Go to your dashboard: ${dashboardUrl}

If you have any questions, our AI coach Compass is always here to help!

- The Career Forward Team
      `.trim(),
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Email send error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}

/**
 * Send payment failure notification email
 */
export async function sendPaymentFailedEmail(
  email: string,
  firstName?: string,
  attemptCount?: number
): Promise<SendEmailResult> {
  const billingUrl = `${APP_URL}/settings?tab=billing`;
  const name = firstName || "there";
  const attempt = attemptCount || 1;

  // Customize message based on attempt count
  const urgencyMessage = attempt >= 3
    ? "This is your final notice before your premium subscription is canceled."
    : attempt === 2
    ? "Please update your payment method soon to avoid losing premium access."
    : "Please update your payment information to continue enjoying premium features.";

  try {
    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: attempt >= 3
        ? "Action Required: Payment Failed for Career Forward"
        : "Action Required: Update Your Payment Information",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #0d9488; margin: 0;">Career Forward</h1>
  </div>

  <h2 style="color: #1f2937;">Payment Update Needed</h2>

  <p>Hey ${name},</p>

  <p>We were unable to process your recent payment for your Career Forward Premium subscription.</p>

  <p style="color: #dc2626; font-weight: 500;">${urgencyMessage}</p>

  <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 20px 0;">
    <p style="color: #991b1b; margin: 0; font-size: 14px;">
      <strong>What happens if I don't update my payment?</strong><br>
      After multiple failed attempts, your subscription will be automatically canceled and you'll lose access to:
    </p>
    <ul style="color: #991b1b; margin: 10px 0 0 0; font-size: 14px;">
      <li>Unlimited AI Coach conversations</li>
      <li>Advanced resume scoring features</li>
      <li>Priority job matching</li>
      <li>Premium interview prep content</li>
    </ul>
  </div>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${billingUrl}" style="background-color: #0d9488; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
      Update Payment Method
    </a>
  </div>

  <p style="color: #6b7280; font-size: 14px;">
    If you believe this is an error or need assistance, please reply to this email or contact our support team.
  </p>

  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

  <p style="color: #9ca3af; font-size: 12px; text-align: center;">
    Career Forward - Your pathway to career success<br>
    &copy; ${new Date().getFullYear()} Career Forward. All rights reserved.
  </p>
</body>
</html>
      `,
      text: `
Hey ${name},

We were unable to process your recent payment for your Career Forward Premium subscription.

${urgencyMessage}

What happens if I don't update my payment?
After multiple failed attempts, your subscription will be automatically canceled and you'll lose access to:
- Unlimited AI Coach conversations
- Advanced resume scoring features
- Priority job matching
- Premium interview prep content

Update your payment method here: ${billingUrl}

If you believe this is an error or need assistance, please reply to this email.

- The Career Forward Team
      `.trim(),
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Email send error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}

/**
 * Send subscription canceled email
 */
export async function sendSubscriptionCanceledEmail(
  email: string,
  firstName?: string,
  endDate?: Date
): Promise<SendEmailResult> {
  const pricingUrl = `${APP_URL}/pricing`;
  const name = firstName || "there";
  const formattedEndDate = endDate
    ? endDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "soon";

  try {
    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Your Career Forward Premium subscription has ended",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #0d9488; margin: 0;">Career Forward</h1>
  </div>

  <h2 style="color: #1f2937;">We're sorry to see you go</h2>

  <p>Hey ${name},</p>

  <p>Your Career Forward Premium subscription has been canceled and will remain active until <strong>${formattedEndDate}</strong>.</p>

  <p>You'll still have access to our free features, including:</p>
  <ul style="color: #4b5563;">
    <li>Basic resume builder</li>
    <li>Job board search</li>
    <li>Application tracker</li>
    <li>Limited AI Coach messages (5 per day)</li>
  </ul>

  <p>We'd love to have you back! If you change your mind, you can resubscribe anytime:</p>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${pricingUrl}" style="background-color: #0d9488; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
      Resubscribe to Premium
    </a>
  </div>

  <p style="color: #6b7280; font-size: 14px;">
    If you canceled by mistake or have any feedback, we'd love to hear from you. Just reply to this email.
  </p>

  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

  <p style="color: #9ca3af; font-size: 12px; text-align: center;">
    Career Forward - Your pathway to career success<br>
    &copy; ${new Date().getFullYear()} Career Forward. All rights reserved.
  </p>
</body>
</html>
      `,
      text: `
Hey ${name},

Your Career Forward Premium subscription has been canceled and will remain active until ${formattedEndDate}.

You'll still have access to our free features, including:
- Basic resume builder
- Job board search
- Application tracker
- Limited AI Coach messages (5 per day)

We'd love to have you back! If you change your mind, you can resubscribe anytime:
${pricingUrl}

If you canceled by mistake or have any feedback, we'd love to hear from you.

- The Career Forward Team
      `.trim(),
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Email send error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}

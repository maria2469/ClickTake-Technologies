import nodemailer from "nodemailer";

interface SendMailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail({ to, subject, html }: SendMailParams) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const gmailUser = process.env.GMAIL_USER || process.env.VITE_GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.VITE_GMAIL_APP_PASSWORD;

  if (resendApiKey) {
    const fromAddress = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `ClickTake Technologies <${fromAddress}>`,
        to: [to],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Resend API error (${res.status}): ${errBody}`);
    }

    return res.json();
  } else if (gmailUser && gmailPass) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    const mailOptions = {
      from: `"ClickTake Technologies" <${gmailUser}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } else {
    throw new Error(
      "No mail credentials found. Please configure RESEND_API_KEY or GMAIL_USER and GMAIL_APP_PASSWORD in your environment."
    );
  }
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function inquiryThankYouEmail(name: string) {
  return {
    subject: "Thanks for reaching out to ClickTake Technologies",
    html: `
      <div style="font-family: -apple-system, Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a; padding: 20px; border: 1px solid #eaeaea; rounded: 8px;">
        <h2 style="color: #0891b2; font-size: 20px;">Hi ${escapeHtml(name)}, thanks for getting in touch!</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #333;">We've received your project inquiry and a member of our client strategy team will review it and follow up within <strong>24 hours</strong>.</p>
        <p style="font-size: 14px; line-height: 1.6; color: #333;">In the meantime, if your request is urgent, feel free to reply directly to this email.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="font-size: 13px; color: #666; line-height: 1.6;">Best regards,<br/><strong>The ClickTake Technologies Team</strong></p>
      </div>
    `,
  };
}

export function bookingThankYouEmail(name: string, date: string, time: string) {
  return {
    subject: "Your Discovery Call with ClickTake Technologies is Confirmed",
    html: `
      <div style="font-family: -apple-system, Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a; padding: 20px; border: 1px solid #eaeaea; rounded: 8px;">
        <h2 style="color: #7c3aed; font-size: 20px;">Hi ${escapeHtml(name)}, your call is booked!</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #333;">We've scheduled your 30-minute discovery session for:</p>
        <p style="font-size: 18px; font-weight: bold; color: #7c3aed; background: #f5f3ff; padding: 12px; border-radius: 6px; text-align: center; margin: 16px 0;">
          ${escapeHtml(date)} at ${escapeHtml(time)}
        </p>
        <p style="font-size: 14px; line-height: 1.6; color: #333;">A calendar invite with the Google Meet link will follow separately.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="font-size: 13px; color: #666; line-height: 1.6;">Talk soon,<br/><strong>The ClickTake Technologies Team</strong></p>
      </div>
    `,
  };
}
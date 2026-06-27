import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

// Initialize admin client to bypass RLS
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);
import type { InquiryFormValues, BookingFormValues } from "./ContactSchema";
import { sendMail, inquiryThankYouEmail, bookingThankYouEmail } from "./Mailer";
import { verifyTurnstileToken } from "./Turnstile";

export const submitInquiry = createServerFn({ method: "POST" })
  .inputValidator((values: InquiryFormValues) => values)
  .handler(async ({ data: values }) => {
    // 1. Verify Turnstile CAPTCHA Token
    const verify = await verifyTurnstileToken(values.turnstileToken);
    if (!verify.success) {
      throw new Error(verify.error || "CAPTCHA verification failed. Please try again.");
    }

    // 2. Prepare Lead details
    const newLead = {
      name: values.name,
      email: values.email,
      phone: "",
      service_interest: values.service,
      source_page: "Strategic Inquiry Form",
      status: "New",
      message: values.message,
      internal_notes: JSON.stringify([
        `Budget: ${values.budget}`,
        values.company ? `Company: ${values.company}` : "",
      ].filter(Boolean)),
    };

    // 3. Insert Lead into Database (with fallback for 'message' column)
    let { data: inserted, error: insertError } = await supabaseAdmin
      .from("leads")
      .insert(newLead)
      .select();

    if (insertError && insertError.message.includes("Could not find the 'message' column")) {
      const { message, ...newLeadNoMsg } = newLead;
      newLeadNoMsg.internal_notes = JSON.stringify([
        `Message: ${values.message}`,
        `Budget: ${values.budget}`,
        values.company ? `Company: ${values.company}` : "",
      ].filter(Boolean));

      const res = await supabaseAdmin.from("leads").insert(newLeadNoMsg).select();
      inserted = res.data;
      insertError = res.error;
    }

    if (insertError || !inserted || inserted.length === 0) {
      throw new Error(`Failed to save inquiry: ${insertError?.message || "Unknown database error"}`);
    }

    // 4. Send Auto-Responder Email (respect workflow toggle)
    try {
      const { data: workflows } = await supabaseAdmin
        .from("email_workflows")
        .select("id")
        .eq("trigger_event", "New Lead Inquiry")
        .eq("enabled", true)
        .limit(1);
      if (workflows && workflows.length > 0) {
        const { data: templates } = await supabaseAdmin
          .from("email_templates")
          .select("subject, body")
          .limit(1);
        if (templates && templates.length > 0) {
          await sendMail({ to: values.email, subject: templates[0].subject, html: templates[0].body });
        } else {
          const ec = inquiryThankYouEmail(values.name);
          await sendMail({ to: values.email, subject: ec.subject, html: ec.html });
        }
      } else {
        const ec = inquiryThankYouEmail(values.name);
        await sendMail({ to: values.email, subject: ec.subject, html: ec.html });
      }
    } catch (emailErr: any) {
      console.error("Auto-responder email dispatch failed:", emailErr.message);
    }

    return { success: true, leadId: inserted[0].id };
  });

async function sendDefaultBookingEmail(values: { name: string; date: string; time: string; email: string }) {
  const encodeDate = (dateStr: string, timeStr: string) => encodeURIComponent(`${dateStr} ${timeStr}`);
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Discovery+Call&dates=${encodeDate(values.date, values.time)}`;
  await sendMail({
    to: values.email,
    subject: "Your Call is Booked",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <h2 style="color: #4F46E5;">Booking Confirmed: Discovery Call</h2>
        <p>Hi ${values.name},</p>
        <p>Thank you for booking a discovery session with <strong>ClickTake Technologies</strong>! We truly value your time and are excited to dive deep into your project goals, technical requirements, and see how we can bring your vision to life.</p>
        <div style="background-color: #F9FAFB; padding: 20px; border: 1px solid #E5E7EB; border-radius: 8px; margin: 24px 0;">
          <p style="margin: 0 0 12px 0; font-size: 16px;"><strong>Date:</strong> ${values.date}</p>
          <p style="margin: 0; font-size: 16px;"><strong>Time:</strong> ${values.time}</p>
        </div>
        <p>To ensure you have this on your schedule, please add the event to your calendar using the link below:</p>
        <p style="margin: 24px 0;">
          <a href="${calendarUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">📅 Add to Google Calendar</a>
        </p>
        <p>If there are any preliminary documents, links, or specific tasks you would like us to review before our call, please feel free to reply directly to this email.</p>
        <p>We are looking forward to our conversation!</p>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 32px 0;" />
        <p style="font-size: 12px; color: #6B7280;">Best regards,<br><strong style="color: #374151;">The ClickTake Team</strong></p>
      </div>
    `,
  });
}

export const submitBooking = createServerFn({ method: "POST" })
  .inputValidator((values: BookingFormValues) => values)
  .handler(async ({ data: values }) => {
    // 1. Verify Turnstile CAPTCHA Token
    const verify = await verifyTurnstileToken(values.turnstileToken);
    if (!verify.success) {
      throw new Error(verify.error || "CAPTCHA verification failed. Please try again.");
    }

    // 2. Insert into bookings table
    const { data: inserted, error: insertError } = await supabaseAdmin
      .from("bookings")
      .insert({
        name: values.name,
        email: values.email,
        booking_date: values.date,
        booking_time: values.time,
        status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to save booking: ${insertError.message}`);
    }

    // 3. Send Auto-Responder Email (respect workflow toggle)
    try {
      const { data: workflows } = await supabaseAdmin
        .from("email_workflows")
        .select("id")
        .eq("trigger_event", "New Booking")
        .eq("enabled", true)
        .limit(1);
      if (workflows && workflows.length > 0) {
        const { data: templates } = await supabaseAdmin
          .from("email_templates")
          .select("subject, body")
          .limit(1);
        if (templates && templates.length > 0) {
          await sendMail({ to: values.email, subject: templates[0].subject, html: templates[0].body });
        } else {
          await sendDefaultBookingEmail(values);
        }
      } else {
        await sendDefaultBookingEmail(values);
      }
    } catch (emailErr: any) {
      console.error("Auto-responder email dispatch failed:", emailErr.message);
    }

    return { success: true, leadId: inserted.id };
  });
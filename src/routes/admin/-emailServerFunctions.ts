import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

// Initialize admin client to bypass RLS
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);
import { sendMail } from "@/lib/Mailer";
import { logAudit } from "@/lib/logAudit";

export const sendAdminReply = createServerFn({ method: "POST" })
  .inputValidator((data: { leadId: string; replyText: string }) => data)
  .handler(async ({ data: { leadId, replyText } }) => {
    // 1. Fetch the lead info
    const { data: lead, error: fetchError } = await supabaseAdmin
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (fetchError || !lead) {
      throw new Error(`Lead not found: ${fetchError?.message || "Unknown error"}`);
    }

    // 2. Send the email
    const subject = `Re: Inquiry about ${lead.service_interest || "Digital Solutions"}`;
    await sendMail({
      to: lead.email,
      subject,
      html: `
        <div style="font-family: -apple-system, Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
          <div style="white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #333;">${replyText}</div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="font-size: 11px; color: #999; line-height: 1.5;">
            This email was sent by ClickTake Technologies Admin. Reply directly to this email to continue the conversation.
          </p>
        </div>
      `,
    });

    // 3. Append the email to internal_notes
    let notes: string[] = [];
    try {
      notes = typeof lead.internal_notes === "string"
        ? JSON.parse(lead.internal_notes)
        : (Array.isArray(lead.internal_notes) ? lead.internal_notes : []);
    } catch (e) {}

    const formattedNote = `📧 Email Sent: ${replyText}`;
    notes.push(formattedNote);

    // 4. Update the lead status and notes in DB
    const { error: updateError } = await supabaseAdmin
      .from("leads")
      .update({
        status: "Contacted",
        internal_notes: JSON.stringify(notes),
      })
      .eq("id", leadId);

    if (updateError) {
      throw new Error(`Failed to update lead: ${updateError.message}`);
    }

    // 5. Log audit
    await logAudit(`Sent email reply to ${lead.email}`, "lead", leadId);

    return { success: true };
  });

export const sendAdminCompose = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; name: string; subject: string; bodyText: string }) => data)
  .handler(async ({ data: { email, name, subject, bodyText } }) => {
    // 1. Send the email
    await sendMail({
      to: email,
      subject,
      html: `
        <div style="font-family: -apple-system, Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
          <div style="white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #333;">${bodyText}</div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="font-size: 11px; color: #999; line-height: 1.5;">
            This email was sent by ClickTake Technologies Admin. Reply directly to this email to continue the conversation.
          </p>
        </div>
      `,
    });

    // 2. Check if lead already exists with this email
    const { data: existingLeads } = await supabaseAdmin
      .from("leads")
      .select("*")
      .eq("email", email)
      .limit(1);

    let leadId = "";

    if (existingLeads && existingLeads.length > 0) {
      const lead = existingLeads[0];
      leadId = lead.id;

      let notes: string[] = [];
      try {
        notes = typeof lead.internal_notes === "string"
          ? JSON.parse(lead.internal_notes)
          : (Array.isArray(lead.internal_notes) ? lead.internal_notes : []);
      } catch (e) {}

      notes.push(`📧 Email Sent (Outbound: "${subject}"): ${bodyText}`);

      await supabaseAdmin
        .from("leads")
        .update({
          status: "Contacted",
          internal_notes: JSON.stringify(notes),
        })
        .eq("id", leadId);
    } else {
      const newLead = {
        name,
        email,
        phone: "",
        service_interest: "Outbound Outreach",
        source_page: "Admin Outbound Compose",
        status: "Contacted",
        message: `Outbound thread started: ${subject}`,
        internal_notes: JSON.stringify([`📧 Email Sent (Outbound: "${subject}"): ${bodyText}`]),
      };

      // Try inserting with message column, fallback if it errors
      let { data: inserted, error: insertError } = await supabaseAdmin
        .from("leads")
        .insert(newLead)
        .select();

      if (insertError && insertError.message.includes("Could not find the 'message' column")) {
        const { message, ...newLeadNoMsg } = newLead;
        newLeadNoMsg.internal_notes = JSON.stringify([
          `Outbound thread started: ${subject}`,
          `📧 Email Sent (Outbound: "${subject}"): ${bodyText}`
        ]);
        const res = await supabaseAdmin.from("leads").insert(newLeadNoMsg).select();
        inserted = res.data;
        insertError = res.error;
      }

      if (insertError || !inserted || inserted.length === 0) {
        throw new Error(`Failed to create outbound lead: ${insertError?.message || "Unknown error"}`);
      }
      leadId = inserted[0].id;
    }

    // 3. Log audit
    await logAudit(`Initiated outbound email to ${email}`, "lead", leadId);

    return { success: true, leadId };
  });

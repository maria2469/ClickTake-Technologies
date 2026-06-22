import { z } from "zod";

// ─── Strategic Inquiry Form Schema ─────────────────────────────────────────
export const inquirySchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name is too long"),
    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Enter a valid email address"),
    company: z.string().trim().max(150, "Company name is too long").optional().or(z.literal("")),
    service: z.enum([
        "Web Dev",
        "AI Solutions",
        "SEO Marketing",
        "Creative Branding",
        "Starter Kit",
    ]),
    budget: z.enum([
        "Under £5,000",
        "£5,000 - £10,000",
        "£10,000 - £25,000",
        "£25,000+",
    ]),
    message: z
        .string()
        .trim()
        .min(20, "Please describe your project in at least 20 characters")
        .max(3000, "Message is too long (max 3000 characters)"),
    // Turnstile token — required, filled by the widget, verified server-side
    turnstileToken: z.string().min(1, "Please complete the CAPTCHA verification"),
});

export type InquiryFormValues = z.infer<typeof inquirySchema>;

// ─── Discovery Call Booking Schema ─────────────────────────────────────────
export const bookingSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
    date: z.string().min(1, "Please select a date"),
    time: z.string().min(1, "Please select a time slot"),
    turnstileToken: z.string().min(1, "Please complete the CAPTCHA verification"),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
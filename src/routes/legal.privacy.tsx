import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Calendar, Lock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundScene } from "@/components/BackgroundScene";
import { CustomCursor } from "@/components/CustomCursor";
import { motion } from "framer-motion";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — ClickTake Technologies" },
      {
        name: "description",
        content:
          "Read the privacy policy and data protection terms for ClickTake Technologies. Learn how we handle your business information.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <BackgroundScene />
      <CustomCursor />
      <Navbar />

      <main className="relative z-10 pt-28 pb-24">
        <section className="mx-auto max-w-4xl px-4 py-12">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="border-b border-border/50 pb-8 mb-8 text-center sm:text-left relative"
          >
            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 w-32 h-32 bg-cyan-500/20 blur-[50px] -z-10 rounded-full" />
            
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-glow mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Privacy Policy
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground justify-center sm:justify-start">
              <span className="flex items-center gap-1.5 bg-secondary/50 border border-border px-3 py-1.5 rounded-full backdrop-blur-sm">
                <Calendar className="h-3.5 w-3.5 text-primary" /> Last Updated: May 26, 2026
              </span>
              <span className="flex items-center gap-1.5 bg-secondary/50 border border-border px-3 py-1.5 rounded-full backdrop-blur-sm">
                <Lock className="h-3.5 w-3.5 text-green-500" /> GDPR & UK DPA Compliant
              </span>
            </div>
          </motion.div>

          {/* Policy content */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              hidden: {}
            }}
            className="space-y-6 text-sm leading-7 text-muted-foreground"
          >
            
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-md shadow-sm transition-colors hover:bg-card/60 hover:border-border/80"
            >
              <h2 className="text-lg font-display font-bold text-foreground mb-3 flex items-center gap-2">
                <span className="text-primary text-xs">01</span> Introduction & Scope
              </h2>
              <p>
                ClickTake Technologies Ltd. ("we", "us", "our") respects your privacy and is committed to protecting your personal data. This privacy policy informs you how we look after your personal data when you visit our website, submit discovery calls, fill out project inquiry forms, or apply for vacancies.
              </p>
            </motion.div>

            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-md shadow-sm transition-colors hover:bg-card/60 hover:border-border/80"
            >
              <h2 className="text-lg font-display font-bold text-foreground mb-3 flex items-center gap-2">
                <span className="text-primary text-xs">02</span> Personal Data We Collect
              </h2>
              <p>
                We may collect, use, store and transfer different kinds of personal data about you, including:
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-2 text-foreground/80">
                <li><strong className="text-foreground">Identity Data:</strong> First name, last name, username, and job titles.</li>
                <li><strong className="text-foreground">Contact Data:</strong> Email address, telephone numbers, billing addresses, and country.</li>
                <li><strong className="text-foreground">Technical Data:</strong> IP address, login data, browser types, operating systems, and device specs.</li>
                <li><strong className="text-foreground">Usage Data:</strong> Information about how you interact with our website services, forms, and calculators.</li>
              </ul>
            </motion.div>

            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-md shadow-sm transition-colors hover:bg-card/60 hover:border-border/80"
            >
              <h2 className="text-lg font-display font-bold text-foreground mb-3 flex items-center gap-2">
                <span className="text-primary text-xs">03</span> How We Use Your Data
              </h2>
              <p>
                We will only use your personal data when the law allows us to. Most commonly, we will use your data in the following circumstances:
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-2 text-foreground/80">
                <li>To register you as a new customer and scope your project requirements.</li>
                <li>To deliver custom development, search engine optimization campaigns, and automation pipelines.</li>
                <li>To manage our ongoing partnership relation (notifying you about milestones, payments, or updates).</li>
                <li>To screen prospective applicants who submit portfolios via our Careers portal.</li>
              </ul>
            </motion.div>

            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-md shadow-sm transition-colors hover:bg-card/60 hover:border-border/80"
            >
              <h2 className="text-lg font-display font-bold text-foreground mb-3 flex items-center gap-2">
                <span className="text-primary text-xs">04</span> Data Security
              </h2>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. We limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
              </p>
            </motion.div>

            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-md shadow-sm transition-colors hover:bg-card/60 hover:border-border/80"
            >
              <h2 className="text-lg font-display font-bold text-foreground mb-3 flex items-center gap-2">
                <span className="text-primary text-xs">05</span> Data Retention & Your Rights
              </h2>
              <p>
                Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, or object to processing. If you wish to exercise any of these rights, please contact our team at <strong className="text-foreground">privacy@clicktaketech.com</strong>.
              </p>
            </motion.div>

          </motion.div>

        </section>
      </main>

      <Footer />
    </div>
  );
}

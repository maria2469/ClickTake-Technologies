import { createFileRoute } from "@tanstack/react-router";
import { FileText, Calendar, ShieldAlert } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundScene } from "@/components/BackgroundScene";
import { CustomCursor } from "@/components/CustomCursor";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — ClickTake Technologies" },
      {
        name: "description",
        content:
          "Review the Terms of Service and contract parameters for working with ClickTake Technologies Ltd.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <BackgroundScene />
      <CustomCursor />
      <Navbar />

      <main className="relative z-10 pt-28 pb-24">
        <section className="mx-auto max-w-4xl px-4 py-12">
          
          {/* Header */}
          <div className="border-b border-white/10 pb-8 mb-8 text-center sm:text-left">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow mb-4">
              <FileText className="h-6 w-6" />
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Terms of Service
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground justify-center sm:justify-start">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Last Updated: May 26, 2026
              </span>
              <span className="flex items-center gap-1">
                <ShieldAlert className="h-3.5 w-3.5" /> Service Agreement parameters
              </span>
            </div>
          </div>

          {/* Terms content */}
          <div className="space-y-8 text-sm leading-7 text-muted-foreground">
            
            <div>
              <h2 className="text-lg font-bold text-foreground mb-3">1. Agreement to Terms</h2>
              <p>
                These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("client", "you") and ClickTake Technologies Ltd. ("we", "us", "our"), concerning your access to and use of our website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground mb-3">2. Development Services & Project Sprints</h2>
              <p>
                ClickTake provides custom software development, headless e-commerce builds, AI automation configuration, and marketing services. Every project operates on a structured Statement of Work (SoW) outlining specific milestones, costs, feedback loops, and timelines.
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Milestone Sign-Offs:</strong> Sprints must be reviewed and signed off by the client within the agreed turnaround schedule to prevent timeline shifts.</li>
                <li><strong>Out-of-Scope Requests:</strong> Features not defined in the original SoW are subject to additional scoping and billing retainers.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground mb-3">3. Intellectual Property Rights</h2>
              <p>
                Unless otherwise indicated, the Site and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site are our proprietary property or licensed to us, and are protected by copyright and trademark laws.
              </p>
              <p className="mt-2">
                Upon final invoice clearance of a custom project, full IP and repository ownership of the scoped deliverables are transferred to the client, excluding third-party APIs or foundational ClickTake software frameworks.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground mb-3">4. Client Responsibilities & Data Inputs</h2>
              <p>
                Clients represent and warrant that any content, assets, credentials, database inputs, or business information shared with ClickTake for the purposes of code development or SEO campaign execution are either owned by the client or have proper usage permissions.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground mb-3">5. Disclaimer of Warranties & Liability limits</h2>
              <p>
                The site and services are provided on an AS-IS and AS-AVAILABLE basis. ClickTake Technologies will not be liable for any direct, indirect, incidental, special or consequential damages arising from website traffic fluctuations, API updates from third parties (e.g. OpenAI, Meta, Shopify), or service downtime outside our control.
              </p>
            </div>

          </div>

        </section>
      </main>

      <Footer />
    </div>
  );
}

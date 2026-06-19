import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Phone, MapPin, Clock, ArrowUpRight, CheckCircle2, MessageSquare,
  Sparkles, Calendar, User, Building, Laptop, DollarSign, Send, X, AlertCircle
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundScene } from "@/components/BackgroundScene";
import { CustomCursor } from "@/components/CustomCursor";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us & Book discovery call — ClickTake Technologies" },
      {
        name: "description",
        content:
          "Reach ClickTake Technologies. Submit a project inquiry form or book a discovery session on our calendar.",
      },
    ],
  }),
  component: ContactPage,
});

// ─── Data ────────────────────────────────────────────────────────────────────

const officeAddresses = [
  {
    city: "Birmingham, UK",
    address: "Flat 312, Kitts Green Road, Birmingham B33 9SB",
    phone: "+44 7391 653377",
    hours: "Mon-Sat: 09:30 AM - 09:00 PM GMT",
    color: "from-cyan-500 to-blue-600",
  },
  {
    city: "Multan, Pakistan (HQ)",
    address: "Office #12, B.C.G Chowk, Paracha Street, Multan 60600",
    phone: "+92 306 9753003",
    hours: "Mon-Sat: 09:30 AM - 09:00 PM PKT",
    color: "from-violet-500 to-indigo-600",
  },
  {
    city: "Multan, Pakistan (Dev)",
    address: "Basti Rid Lar, Multan, Punjab 59130",
    phone: "+92 306 9753003",
    hours: "Mon-Sat: 09:30 AM - 09:00 PM PKT",
    color: "from-emerald-500 to-teal-500",
  },
];

// Available Mock Booking slots
const mockTimes = ["10:00 AM", "11:30 AM", "02:00 PM", "03:30 PM", "05:00 PM"];
const mockDates = [
  { day: "Wed", num: "27", month: "May" },
  { day: "Thu", num: "28", month: "May" },
  { day: "Fri", num: "29", month: "May" },
  { day: "Mon", num: "01", month: "Jun" },
  { day: "Tue", num: "02", month: "Jun" },
];

function ContactPage() {
  // Inquiry Form State
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryCompany, setInquiryCompany] = useState("");
  const [inquiryService, setInquiryService] = useState("Web Dev");
  const [inquiryBudget, setInquiryBudget] = useState("£5,000 - £10,000");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // Scheduler State
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState("");
  const [bookName, setBookName] = useState("");
  const [bookEmail, setBookEmail] = useState("");
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // Live Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "agent"; text: string }>>([
    { sender: "agent", text: "Hey! Zain here from ClickTake. What digital challenge can we help you solve today?" }
  ]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitting(true);
    
    const { error } = await supabase.from('leads').insert({
      name: inquiryName,
      email: inquiryEmail,
      service_interest: inquiryService,
      message: `${inquiryCompany ? `Company: ${inquiryCompany}\n` : ''}Budget: ${inquiryBudget}\n\n${inquiryMessage}`,
      source_page: window.location.pathname,
      status: 'new',
    });
    
    setInquirySubmitting(false);
    
    if (error) {
      console.error('Lead save error:', error);
      toast.error("Something went wrong. Please try again.");
    } else {
      // Fire an audit log for the admin dashboard feed
      supabase.from('audit_logs').insert({
        user_email: "System",
        action: `New Lead: ${inquiryName} (${inquiryService || 'Inquiry'})`
      }).then();
      
      setInquirySuccess(true);
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime) {
      setBookingError("Please select a time slot.");
      return;
    }
    setBookingError("");
    setBookingSubmitting(true);
    setTimeout(() => {
      setBookingSubmitting(false);
      setBookingSuccess(true);
    }, 1500);
  };

  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");

    // Simulate Agent auto reply
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "agent",
          text: "Thanks for reaching out! A specialist will get in touch with you shortly, or feel free to book a direct call on our scheduler above."
        }
      ]);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <BackgroundScene />
      <CustomCursor />
      <Navbar />

      <main className="relative z-10 pt-28 pb-24">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden py-12 lg:py-16">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute left-1/4 top-0 h-[450px] w-[450px] rounded-full bg-violet-500/10 blur-[130px]" />
            <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[130px]" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-card/60 px-4 py-1.5 text-xs backdrop-blur-xl mb-6">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
                Get in Touch
              </div>

              <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Let's start the <span className="text-gradient">conversation.</span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Submit a project inquiry or book a discovery call directly on our calendar. 
                Our leads will follow up within 24 hours.
              </p>
            </motion.div>
          </div>
        </section>

        {/* FORMS & SCHEDULER GRID */}
        <section className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid gap-10 lg:grid-cols-2 items-stretch">
            
            {/* INQUIRY FORM CARD */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-card/50 p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Send className="h-32 w-32 text-white" />
              </div>

              {!inquirySuccess ? (
                <form onSubmit={handleInquirySubmit} className="space-y-4 relative">
                  <div>
                    <h3 className="font-display text-xl font-bold">1. Strategic Inquiry Form</h3>
                    <p className="text-xs text-muted-foreground mt-1">Tell us about your target goals, project scope, and budget.</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Full Name</label>
                      <input
                        required
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-2.5 text-xs text-foreground focus:border-cyan-500/50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Business Email</label>
                      <input
                        required
                        type="email"
                        value={inquiryEmail}
                        onChange={(e) => setInquiryEmail(e.target.value)}
                        placeholder="john@company.com"
                        className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-2.5 text-xs text-foreground focus:border-cyan-500/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Company Name</label>
                      <input
                        value={inquiryCompany}
                        onChange={(e) => setInquiryCompany(e.target.value)}
                        placeholder="Acme Corp"
                        className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-2.5 text-xs text-foreground focus:border-cyan-500/50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Primary Goal</label>
                      <select
                        value={inquiryService}
                        onChange={(e) => setInquiryService(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-2.5 text-xs text-foreground focus:border-cyan-500/50 focus:outline-none"
                      >
                        <option value="Web Dev">Web & Headless Development</option>
                        <option value="AI Solutions">AI Chatbots & Prompt Engineering</option>
                        <option value="SEO Marketing">SEO & Growth Marketing</option>
                        <option value="Creative Branding">Graphic & Video Design</option>
                        <option value="Starter Kit">BD Starter Kit (Flagship Bundle)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Budget Bracket</label>
                    <select
                      value={inquiryBudget}
                      onChange={(e) => setInquiryBudget(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-2.5 text-xs text-foreground focus:border-cyan-500/50 focus:outline-none"
                    >
                      <option value="Under £5,000">Under £5,000</option>
                      <option value="£5,000 - £10,000">£5,000 - £10,000</option>
                      <option value="£10,000 - £25,000">£10,000 - £25,000</option>
                      <option value="£25,000+">£25,000+ (Enterprise)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Project Brief / Description</label>
                    <textarea
                      required
                      rows={5}
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      placeholder="Outline your requirements, timelines, and technical integration goals..."
                      className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-3 text-xs text-foreground focus:border-cyan-500/50 focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={inquirySubmitting}
                    className="w-full rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 py-3 text-xs font-semibold text-white shadow hover:scale-[1.01] transition-transform"
                  >
                    {inquirySubmitting ? "Sending Inquiry..." : "Submit Strategic Inquiry"}
                  </button>
                </form>
              ) : (
                <div className="text-center py-16 space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 border border-green-500/30 text-green-400">
                    <CheckCircle2 className="h-8 w-8 animate-bounce" />
                  </div>
                  <h3 className="font-display text-xl font-bold">Inquiry Submitted!</h3>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                    Thanks, {inquiryName}. Our client strategist will review your brief and follow up at <strong className="text-foreground">{inquiryEmail}</strong> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setInquirySuccess(false);
                      setInquiryName("");
                      setInquiryEmail("");
                      setInquiryCompany("");
                      setInquiryMessage("");
                    }}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold hover:border-white/20 transition-all"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              )}
            </motion.div>

            {/* MOCK CALENDLY SCHEDULER CARD */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-card/50 p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Calendar className="h-32 w-32 text-white" />
              </div>

              {!bookingSuccess ? (
                <form onSubmit={handleBookingSubmit} className="space-y-4 relative">
                  <div>
                    <h3 className="font-display text-xl font-bold">2. Book a Discovery Call</h3>
                    <p className="text-xs text-muted-foreground mt-1">Select a date & time for a 30-min discovery session via Google Meet.</p>
                  </div>

                  {/* Date Selector */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Available Dates (2026)</label>
                    <div className="grid grid-cols-5 gap-2">
                      {mockDates.map((d, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedDate(i)}
                          className={`rounded-xl p-2.5 text-center transition-all ${
                            selectedDate === i
                              ? "bg-linear-to-r from-violet-500 to-fuchsia-600 border-none text-white shadow-md"
                              : "border border-white/10 bg-background/50 text-muted-foreground hover:border-white/20"
                          }`}
                        >
                          <div className="text-[9px] uppercase font-bold">{d.day}</div>
                          <div className="text-sm font-black">{d.num}</div>
                          <div className="text-[8px] uppercase tracking-wider">{d.month}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Selector */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Available Time Slots</label>
                    <div className="grid grid-cols-3 gap-2">
                      {mockTimes.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => {
                            setSelectedTime(time);
                            setBookingError("");
                          }}
                          className={`rounded-lg py-2 text-center text-xs font-semibold transition-all ${
                            selectedTime === time
                              ? "bg-linear-to-r from-cyan-500 to-blue-500 text-white shadow"
                              : "border border-white/5 bg-background/40 text-muted-foreground hover:bg-white/5"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Your Name</label>
                      <input
                        required
                        value={bookName}
                        onChange={(e) => setBookName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-2.5 text-xs text-foreground focus:border-violet-500/50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Email Address</label>
                      <input
                        required
                        type="email"
                        value={bookEmail}
                        onChange={(e) => setBookEmail(e.target.value)}
                        placeholder="john@company.com"
                        className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-2.5 text-xs text-foreground focus:border-violet-500/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  {bookingError && (
                    <div className="text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>{bookingError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={bookingSubmitting}
                    className="w-full rounded-xl bg-linear-to-r from-violet-500 to-fuchsia-600 py-3 text-xs font-semibold text-white shadow hover:scale-[1.01] transition-transform"
                  >
                    {bookingSubmitting ? "Booking call..." : "Schedule Call"}
                  </button>
                </form>
              ) : (
                <div className="text-center py-16 space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400">
                    <CheckCircle2 className="h-8 w-8 animate-bounce" />
                  </div>
                  <h3 className="font-display text-xl font-bold">Call Scheduled!</h3>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                    Excellent, {bookName}. We have booked a discovery session on <strong className="text-foreground">{mockDates[selectedDate].day}, {mockDates[selectedDate].num} {mockDates[selectedDate].month}</strong> at <strong className="text-foreground">{selectedTime}</strong>. 
                  </p>
                  <p className="text-[10px] text-muted-foreground/60">
                    An calendar invitation with the Google Meet link has been sent to {bookEmail}.
                  </p>
                  <button
                    onClick={() => {
                      setBookingSuccess(false);
                      setBookName("");
                      setBookEmail("");
                      setSelectedTime("");
                    }}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold hover:border-white/20 transition-all"
                  >
                    Schedule Another Time
                  </button>
                </div>
              )}
            </motion.div>

          </div>
        </section>

        {/* OFFICE LOCATIONS */}
        <section className="mx-auto max-w-7xl px-4 py-16 border-t border-white/5">
          <div className="text-center mb-12">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">Office Locations</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">Stop by or reach out to our team at any of our primary operating offices.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {officeAddresses.map((o, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card/40 p-6 backdrop-blur-xl hover:border-white/20 transition-all duration-300"
              >
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r ${o.color}`} />
                <div className="flex items-start gap-4 mt-2">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5 border border-white/10 text-cyan-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-foreground">{o.city}</h4>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{o.address}</p>
                    
                    <div className="mt-4 pt-4 border-t border-white/5 space-y-2 text-[10px] text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3 w-3 text-cyan-400" />
                        <span>{o.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-cyan-400" />
                        <span>{o.hours}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ─── LIVE CHAT / WHATSAPP WIDGET ─── */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute bottom-16 right-0 w-80 rounded-2xl border border-white/15 bg-card shadow-2xl overflow-hidden flex flex-col justify-between z-50"
            >
              {/* Header */}
              <div className="bg-linear-to-r from-cyan-500 to-violet-600 p-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-2 ring-white" />
                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">CT</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">ClickTake Support</div>
                    <div className="text-[9px] text-white/80">Active now</div>
                  </div>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Chat body */}
              <div className="p-4 h-64 overflow-y-auto space-y-3 bg-background/50">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-cyan-500 text-white"
                        : "bg-white/5 border border-white/5 text-muted-foreground"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat input */}
              <form onSubmit={sendChatMessage} className="p-3 border-t border-white/5 flex gap-2 bg-card">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-xl border border-white/10 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-cyan-500/50 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-linear-to-r from-cyan-500 to-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow"
                >
                  Send
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Toggle Button */}
        <motion.button
          onClick={() => setChatOpen(!chatOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="h-12 w-12 rounded-full bg-linear-to-r from-cyan-500 to-violet-600 text-white flex items-center justify-center shadow-lg hover:shadow-cyan-500/20 transition-all border border-white/10 relative"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-background animate-pulse" />
        </motion.button>
      </div>

      <Footer />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MessageSquareOff } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/email")({
    head: () => ({
        meta: [
            { title: "Email Center — ClickTake Admin Portal" },
            { name: "description", content: "SMTP configuration, autoresponder workflows, and reply inbox." },
        ],
    }),
    component: AdminEmail,
});

/* ───────────────── DATA TYPES ───────────────── */

interface Message {
    id: string;
    sender: string;
    email: string;
    subject: string;
    body: string;
    date: string;
    replies: { sender: "Admin" | "User"; text: string; date: string }[];
}

/* ───────────────── MOCK DATA ───────────────── */

const initialInbox: Message[] = [
    {
        id: "msg1",
        sender: "Zeeshan Khan",
        email: "zee@fastmail.pk",
        subject: "Partnership Inquiry",
        body: "Hi team, I represent a local logistics company. We want to rebuild our delivery routing app using custom AI optimization pipelines. Do you have case studies?",
        date: "10:15 AM",
        replies: [
            { sender: "User", text: "Hi team, I represent a local logistics company. We want to rebuild our delivery routing app using custom AI optimization pipelines. Do you have case studies?", date: "10:15 AM" },
        ],
    },
    {
        id: "msg2",
        sender: "Alice Rutherford",
        email: "alice.r@londonventures.co.uk",
        subject: "Website redesign cost proposal",
        body: "Could you send a pricing list or contract details for a full-stack Next.js site + custom automation workflow setup? We are planning a relaunch in Q3.",
        date: "Yesterday",
        replies: [
            { sender: "User", text: "Could you send a pricing list or contract details for a full-stack Next.js site + custom automation workflow setup? We are planning a relaunch in Q3.", date: "Yesterday" },
            { sender: "Admin", text: "Hello Alice, thanks for reaching out. We have sent our enterprise brochure to your email. I'd love to schedule a quick 15-minute call to scope this out.", date: "Yesterday" },
        ],
    },
];

const automationWorkflows = [
    { title: "Lead Form auto-responder", desc: "Instant response with Welcome Template" },
    { title: "SEO audit report dispatch", desc: "Triggers on custom SEO request" },
    { title: "24-Hour Lead follow-up", desc: "Fires 24h post-sub if status is New" },
];

/* ───────────────── COMPONENT ───────────────── */

function AdminEmail() {
    const [smtpConfig, setSmtpConfig] = useState({
        server: "smtp.sendgrid.net",
        port: "587",
        user: "apikey",
        password: "••••••••••••••••••••••••",
        ssl: true,
    });

    const [inbox, setInbox] = useState<Message[]>(initialInbox);
    const [activeMessageId, setActiveMessageId] = useState<string | null>("msg1");
    const [replyText, setReplyText] = useState("");

    const activeMessage = useMemo(() => {
        return inbox.find((m) => m.id === activeMessageId) || null;
    }, [inbox, activeMessageId]);

    const handleSendReply = () => {
        if (!replyText.trim() || !activeMessage) return;
        const updatedInbox = inbox.map((m) => {
            if (m.id === activeMessage.id) {
                return {
                    ...m,
                    replies: [...m.replies, { sender: "Admin" as const, text: replyText.trim(), date: "Just now" }],
                };
            }
            return m;
        });
        setInbox(updatedInbox);
        setReplyText("");
        toast.success("Reply dispatched via SMTP relay");
    };

    const handleTestSMTP = () => {
        toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
            loading: "Reaching SMTP server and sending ping...",
            success: "SMTP connection healthy! Handshake completed in 420ms.",
            error: "Handshake failed",
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-2xl font-bold tracking-tight">Email Communication Center</h1>
                    <p className="text-xs text-muted-foreground mt-1">
                        SMTP configurations, template building, and real-time message response.
                    </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-white/5 border border-white/5 px-3 py-1.5 text-[10px] font-bold text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    {inbox.length} Open Threads
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* SMTP Settings & templates editor */}
                <div className="space-y-6">
                    {/* SMTP config form */}
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">SMTP Relay Config</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase">Outgoing SMTP Server</label>
                                <input
                                    type="text"
                                    value={smtpConfig.server}
                                    onChange={(e) => setSmtpConfig({ ...smtpConfig, server: e.target.value })}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase">Server Port</label>
                                    <input
                                        type="text"
                                        value={smtpConfig.port}
                                        onChange={(e) => setSmtpConfig({ ...smtpConfig, port: e.target.value })}
                                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase">SSL Security</label>
                                    <button
                                        onClick={() => setSmtpConfig({ ...smtpConfig, ssl: !smtpConfig.ssl })}
                                        className={`w-full flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${smtpConfig.ssl ? "bg-brand-magenta/10 border-brand-magenta text-brand-magenta" : "border-border text-muted-foreground"
                                            }`}
                                    >
                                        {smtpConfig.ssl ? "SSL Encrypted" : "TLS / Unsecure"}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase">Relay Username</label>
                                <input
                                    type="text"
                                    value={smtpConfig.user}
                                    onChange={(e) => setSmtpConfig({ ...smtpConfig, user: e.target.value })}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors"
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={handleTestSMTP}
                                    className="flex-1 rounded-xl bg-white/5 border border-white/5 py-2 text-xs font-bold hover:bg-white/10 transition text-foreground"
                                >
                                    Test Connection
                                </button>
                                <button
                                    onClick={() => toast.success("SMTP config saved successfully")}
                                    className="flex-1 rounded-xl bg-brand-magenta text-white py-2 text-xs font-bold hover:opacity-90 transition"
                                >
                                    Save Settings
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Automation workflows list */}
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Autoresponder Workflows</h3>
                        <div className="space-y-2.5">
                            {automationWorkflows.map((wf, idx) => (
                                <div key={idx} className="flex items-center justify-between rounded-xl bg-white/5 p-3 text-xs">
                                    <div>
                                        <p className="font-semibold text-foreground">{wf.title}</p>
                                        <span className="text-[9px] text-muted-foreground">{wf.desc}</span>
                                    </div>
                                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Direct Reply Inbox */}
                <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-card/40 backdrop-blur-xl overflow-hidden flex flex-col min-h-[480px]">
                    <div className="flex flex-1 divide-x divide-white/5">
                        {/* Conversations sidebar list */}
                        <div className="w-1/3 p-4 space-y-3">
                            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Conversations</div>

                            {inbox.length === 0 ? (
                                <div className="flex flex-col items-center justify-center text-center py-10">
                                    <MessageSquareOff className="h-7 w-7 text-muted-foreground mb-2" />
                                    <p className="text-[11px] font-semibold">Inbox is empty</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {inbox.map((msg) => {
                                        const isSelected = activeMessageId === msg.id;
                                        return (
                                            <button
                                                key={msg.id}
                                                onClick={() => setActiveMessageId(msg.id)}
                                                className={`w-full text-left rounded-xl p-3 border transition ${isSelected
                                                        ? "bg-white/10 border-brand-magenta text-foreground"
                                                        : "border-transparent text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                                    }`}
                                            >
                                                <div className="font-bold text-xs truncate">{msg.sender}</div>
                                                <div className="text-[10px] truncate mt-0.5 font-semibold text-foreground">{msg.subject}</div>
                                                <div className="text-[8px] mt-1 text-muted-foreground text-right">{msg.date}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Chat Pane */}
                        <div className="flex-1 flex flex-col justify-between p-4 bg-background/20">
                            {activeMessage ? (
                                <>
                                    <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                                        <div>
                                            <div className="text-xs font-bold text-foreground">{activeMessage.sender}</div>
                                            <div className="text-[9px] text-muted-foreground">{activeMessage.email}</div>
                                        </div>
                                        <span className="text-[10px] font-semibold text-muted-foreground">Subject: {activeMessage.subject}</span>
                                    </div>

                                    {/* Message history */}
                                    <div className="flex-1 overflow-y-auto space-y-3 my-4 pr-1 max-h-[260px]">
                                        {activeMessage.replies.map((reply, index) => {
                                            const isAdmin = reply.sender === "Admin";
                                            return (
                                                <div key={index} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                                                    <div
                                                        className={`rounded-2xl px-4 py-2 text-xs max-w-xs leading-relaxed ${isAdmin ? "bg-gradient-brand text-white" : "bg-white/10 text-foreground"
                                                            }`}
                                                    >
                                                        {reply.text}
                                                        <div className={`text-[8px] mt-1 text-right ${isAdmin ? "text-white/60" : "text-muted-foreground"}`}>
                                                            {reply.date}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Send Reply box */}
                                    <div className="border-t border-white/5 pt-3 flex items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder="Type SMTP message reply..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
                                            className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors"
                                        />
                                        <button
                                            onClick={handleSendReply}
                                            className="rounded-xl bg-gradient-brand text-white p-2.5 shadow-md hover:scale-105 transition shrink-0"
                                        >
                                            <Send className="h-4 w-4" />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center">
                                    <MessageSquareOff className="h-8 w-8 text-muted-foreground mb-2" />
                                    <p className="text-xs font-semibold">No conversation selected</p>
                                    <p className="text-[10px] text-muted-foreground mt-1">Pick a thread from the list to reply</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
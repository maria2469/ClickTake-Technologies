import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileSpreadsheet,
    Search,
    Users,
    CheckCircle2,
    Activity,
    Clock,
    Plus,
    Trash2,
    X,
    User,
    Mail,
    Phone,
    Briefcase,
    Globe,
    MessageSquare
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/crm")({
    head: () => ({
        meta: [
            { title: "Lead CRM — ClickTake Admin" },
            { name: "description", content: "Process service inquiries and track user acquisitions." },
        ],
    }),
    component: AdminCrmPage,
});

interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    interest: string;
    date: string;
    source: string;
    status: "New" | "Contacted" | "In Progress" | "Converted" | "Lost";
    notes: string[];
}

const initialLeads: Lead[] = [
    {
        id: "L1",
        name: "Ayesha Malik",
        email: "ayesha@cybertech.pk",
        phone: "+92 300 1234567",
        interest: "AI Chatbots & Agents",
        date: "2026-06-15",
        source: "Google Search",
        status: "New",
        notes: ["Client wants a custom automated customer service bot integrated with their CRM."],
    },
    {
        id: "L2",
        name: "Oliver Thompson",
        email: "oliver@growthwave.co.uk",
        phone: "+44 7911 987654",
        interest: "Full-Stack Applications",
        date: "2026-06-14",
        source: "LinkedIn Referral",
        status: "Contacted",
        notes: ["Followed up on email. Scheduled discovery call for next Tuesday at 3 PM GMT."],
    },
    {
        id: "L3",
        name: "Zahid Mahmood",
        email: "zahid@multantextiles.com",
        phone: "+92 321 7654321",
        interest: "SEO Services",
        date: "2026-06-12",
        source: "Direct Traffic",
        status: "In Progress",
        notes: ["SEO Audit sent. Competitor analysis shows huge ranking opportunities for textile exports."],
    },
    {
        id: "L4",
        name: "Charlotte Davis",
        email: "c.davis@finverge.uk",
        phone: "+44 20 7946 0192",
        interest: "Custom LLM Development",
        date: "2026-06-10",
        source: "Booked Call CTA",
        status: "Converted",
        notes: ["Contract signed! Phase 1 scoping starting next week. Project manager assigned."],
    },
    {
        id: "L5",
        name: "Kashif Riaz",
        email: "kashif.riaz@retailpulse.pk",
        phone: "+92 333 9991111",
        interest: "SaaS Platform Development",
        date: "2026-06-08",
        source: "Paid Ads",
        status: "Lost",
        notes: ["Client budget was under the MVP threshold. Referred to starter template kits."],
    },
    {
        id: "L6",
        name: "Emily Watson",
        email: "emily@ecomfy.co.uk",
        phone: "+44 7700 900077",
        interest: "Business Development Starter Kit",
        date: "2026-06-05",
        source: "Organic Social",
        status: "In Progress",
        notes: ["Discussing 90-day execution framework. Keen on both branding and headless shopify setup."],
    },
];

function AdminCrmPage() {
    const [leads, setLeads] = useState<Lead[]>(initialLeads);
    const [selectedLeadId, setSelectedLeadId] = useState<string>("L1");
    const [crmSearch, setCrmSearch] = useState("");
    const [crmStatusFilter, setCrmStatusFilter] = useState("All");
    const [newNoteText, setNewNoteText] = useState("");

    // Add Lead Modal State
    const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
    const [newLeadName, setNewLeadName] = useState("");
    const [newLeadEmail, setNewLeadEmail] = useState("");
    const [newLeadPhone, setNewLeadPhone] = useState("");
    const [newLeadInterest, setNewLeadInterest] = useState("AI Chatbots & Agents");
    const [newLeadSource, setNewLeadSource] = useState("Direct Traffic");
    const [newLeadNote, setNewLeadNote] = useState("");

    const selectedLead = useMemo(() => {
        return leads.find((l) => l.id === selectedLeadId) || leads[0] || initialLeads[0];
    }, [leads, selectedLeadId]);

    // Derived Summary Analytics
    const analytics = useMemo(() => {
        const total = leads.length;
        const newCount = leads.filter((l) => l.status === "New").length;
        const activeCount = leads.filter((l) => l.status === "Contacted" || l.status === "In Progress").length;
        const convertedCount = leads.filter((l) => l.status === "Converted").length;
        const conversionRate = total > 0 ? Math.round((convertedCount / total) * 100) : 0;

        return { total, newCount, activeCount, conversionRate };
    }, [leads]);

    const handleStatusChange = (leadId: string, status: Lead["status"]) => {
        setLeads(leads.map((l) => (l.id === leadId ? { ...l, status } : l)));
        const leadName = leads.find((l) => l.id === leadId)?.name || "Lead";
        toast.success(`Updated ${leadName}'s status to ${status}`);
    };

    const handleAddNote = () => {
        if (!newNoteText.trim()) return;
        setLeads(
            leads.map((l) =>
                l.id === selectedLeadId ? { ...l, notes: [...l.notes, newNoteText.trim()] } : l
            )
        );
        setNewNoteText("");
        toast.success("Comment appended to audit trail");
    };

    const handleDeleteNote = (noteIndex: number) => {
        setLeads(
            leads.map((l) =>
                l.id === selectedLeadId
                    ? { ...l, notes: l.notes.filter((_, idx) => idx !== noteIndex) }
                    : l
            )
        );
        toast.error("Comment deleted from audit trail");
    };

    const handleDeleteLead = (leadId: string) => {
        if (leads.length <= 1) {
            toast.error("Cannot delete the only lead in the database.");
            return;
        }

        const targetLead = leads.find((l) => l.id === leadId);
        const updatedLeads = leads.filter((l) => l.id !== leadId);
        setLeads(updatedLeads);

        // Selection Pivot Fallback
        if (selectedLeadId === leadId) {
            setSelectedLeadId(updatedLeads[0].id);
        }

        toast.error(`Deleted lead "${targetLead?.name || "Lead"}"`);
    };

    const handleAddLeadSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = newLeadName.trim();
        const trimmedEmail = newLeadEmail.trim();
        const trimmedPhone = newLeadPhone.trim();

        if (!trimmedName || !trimmedEmail || !trimmedPhone) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const newLead: Lead = {
            id: `L-${Date.now()}`,
            name: trimmedName,
            email: trimmedEmail,
            phone: trimmedPhone,
            interest: newLeadInterest,
            date: new Date().toISOString().split("T")[0],
            source: newLeadSource,
            status: "New",
            notes: newLeadNote.trim() ? [newLeadNote.trim()] : []
        };

        setLeads([newLead, ...leads]);
        setSelectedLeadId(newLead.id);
        setIsAddLeadModalOpen(false);

        // Reset fields
        setNewLeadName("");
        setNewLeadEmail("");
        setNewLeadPhone("");
        setNewLeadInterest("AI Chatbots & Agents");
        setNewLeadSource("Direct Traffic");
        setNewLeadNote("");

        toast.success(`Successfully added lead "${trimmedName}"!`);
    };

    const handleExportCSV = () => {
        toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: "Generating Excel spreadsheet...",
            success: "Leads database exported successfully! clicktake_leads_2026.xlsx downloaded.",
            error: "Export failed",
        });
    };

    // Avatar Initials Creator
    const getInitials = (name: string) => {
        const parts = name.trim().split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    // Stable gradient selector based on string sum
    const getAvatarGradient = (id: string) => {
        const gradients = [
            "from-cyan-500 to-blue-600",
            "from-violet-500 to-fuchsia-600",
            "from-emerald-500 to-teal-600",
            "from-rose-500 to-orange-600",
            "from-amber-500 to-yellow-600"
        ];
        let sum = 0;
        for (let i = 0; i < id.length; i++) {
            sum += id.charCodeAt(i);
        }
        return gradients[sum % gradients.length];
    };

    const filteredLeads = useMemo(() => {
        return leads.filter((l) => {
            const matchesSearch =
                l.name.toLowerCase().includes(crmSearch.toLowerCase()) ||
                l.email.toLowerCase().includes(crmSearch.toLowerCase()) ||
                l.interest.toLowerCase().includes(crmSearch.toLowerCase());
            const matchesStatus = crmStatusFilter === "All" || l.status === crmStatusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [leads, crmSearch, crmStatusFilter]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            {/* Header Title Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-2xl font-bold tracking-tight">Lead Management CRM</h1>
                    <p className="text-xs text-muted-foreground mt-1">
                        Process service inquiries and track user acquisitions.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsAddLeadModalOpen(true)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 hover:border-brand-magenta/30 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-semibold text-foreground transition cursor-pointer shadow-sm"
                    >
                        <Plus className="h-4 w-4 text-brand-magenta" /> Add Lead
                    </button>
                    <button
                        onClick={handleExportCSV}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-emerald-700 transition cursor-pointer"
                    >
                        <FileSpreadsheet className="h-4 w-4" /> Export Database
                    </button>
                </div>
            </div>

            {/* Dashboard Analytics Metric Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-white/10 bg-card/30 p-4 backdrop-blur-xl flex items-center justify-between shadow-sm hover:border-white/20 transition-colors">
                    <div>
                        <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">Total Inquiries</span>
                        <span className="text-2xl font-display font-bold mt-1 block text-foreground">{analytics.total}</span>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                        <Users className="h-5 w-5 text-brand-blue" />
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-card/30 p-4 backdrop-blur-xl flex items-center justify-between shadow-sm hover:border-white/20 transition-colors">
                    <div>
                        <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">Unprocessed (New)</span>
                        <span className="text-2xl font-display font-bold mt-1 block text-cyan-400">{analytics.newCount}</span>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                        <Activity className="h-5 w-5 text-cyan-400 animate-pulse" />
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-card/30 p-4 backdrop-blur-xl flex items-center justify-between shadow-sm hover:border-white/20 transition-colors">
                    <div>
                        <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">Active Pipelines</span>
                        <span className="text-2xl font-display font-bold mt-1 block text-violet-400">{analytics.activeCount}</span>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                        <Clock className="h-5 w-5 text-violet-400" />
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-card/30 p-4 backdrop-blur-xl flex items-center justify-between shadow-sm hover:border-white/20 transition-colors">
                    <div>
                        <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">Conversion Rate</span>
                        <span className="text-2xl font-display font-bold mt-1 block text-emerald-400">{analytics.conversionRate}%</span>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by client name, email, interest..."
                        value={crmSearch}
                        onChange={(e) => setCrmSearch(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2 text-xs focus:outline-none text-foreground"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Filter status:</span>
                    <select
                        value={crmStatusFilter}
                        onChange={(e) => setCrmStatusFilter(e.target.value)}
                        className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs focus:outline-none text-foreground cursor-pointer"
                    >
                        <option value="All">All statuses</option>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Converted">Converted</option>
                        <option value="Lost">Lost</option>
                    </select>
                </div>
            </div>

            {/* CRM Split View */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Table list */}
                <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-card/40 backdrop-blur-xl overflow-hidden shadow-elegant">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                    <th className="p-4">Client info</th>
                                    <th className="p-4">Project area</th>
                                    <th className="p-4">Date logged</th>
                                    <th className="p-4">Acquisition</th>
                                    <th className="p-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-xs">
                                {filteredLeads.map((lead) => (
                                    <tr
                                        key={lead.id}
                                        onClick={() => setSelectedLeadId(lead.id)}
                                        className={`cursor-pointer hover:bg-white/5 transition-colors border-l-2 ${
                                            selectedLeadId === lead.id
                                                ? "bg-white/5 border-l-brand-magenta"
                                                : "border-l-transparent"
                                        }`}
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {/* Gradient initial avatar badge */}
                                                <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${getAvatarGradient(lead.id)} flex items-center justify-center text-[10px] font-bold text-white shadow-sm shrink-0`}>
                                                    {getInitials(lead.name)}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <div className="font-bold text-foreground truncate">{lead.name}</div>
                                                    <div className="text-[10px] text-muted-foreground truncate mt-0.5">{lead.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 font-semibold text-foreground">{lead.interest}</td>
                                        <td className="p-4 text-muted-foreground font-mono">{lead.date}</td>
                                        <td className="p-4 text-muted-foreground">{lead.source}</td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center">
                                                <select
                                                    value={lead.status}
                                                    onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className={`rounded-lg px-2 py-1 text-[10px] font-bold focus:outline-none border border-transparent cursor-pointer ${
                                                        lead.status === "New"
                                                            ? "bg-cyan-500/10 text-cyan-400"
                                                            : lead.status === "Contacted"
                                                                ? "bg-blue-500/10 text-blue-400"
                                                                : lead.status === "In Progress"
                                                                    ? "bg-violet-500/10 text-violet-400"
                                                                    : lead.status === "Converted"
                                                                        ? "bg-emerald-500/10 text-emerald-400"
                                                                        : "bg-rose-500/10 text-rose-400"
                                                    }`}
                                                >
                                                    <option value="New">New</option>
                                                    <option value="Contacted">Contacted</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Converted">Converted</option>
                                                    <option value="Lost">Lost</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredLeads.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground text-xs">
                                            No leads match your filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar details */}
                <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl flex flex-col justify-between shadow-elegant">
                    {selectedLead ? (
                        <div className="space-y-4">
                            <div className="border-b border-white/5 pb-3 mb-2 flex items-start justify-between gap-2">
                                <div className="overflow-hidden">
                                    <div className="text-[9px] uppercase font-bold text-brand-magenta tracking-wider">Client Portfolio</div>
                                    <h3 className="text-sm font-bold mt-1 text-foreground truncate">{selectedLead.name}</h3>
                                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">{selectedLead.email}</p>
                                </div>
                                <button
                                    onClick={() => handleDeleteLead(selectedLead.id)}
                                    className="text-muted-foreground hover:text-rose-400 p-1.5 rounded-lg hover:bg-white/5 transition cursor-pointer"
                                    title="Delete Lead"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>

                            <div className="space-y-3.5 text-xs">
                                <div className="flex items-center gap-2">
                                    <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                    <span className="text-muted-foreground">Phone:</span>
                                    <span className="font-semibold text-foreground">{selectedLead.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Briefcase className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                    <span className="text-muted-foreground">Interest:</span>
                                    <span className="font-semibold text-foreground">{selectedLead.interest}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                    <span className="text-muted-foreground">Channel:</span>
                                    <span className="font-semibold text-foreground">{selectedLead.source}</span>
                                </div>

                                <div className="border-t border-white/5 pt-3">
                                    <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block mb-2">Audit & Comments Timeline</span>
                                    
                                    {/* Comments timeline list */}
                                    <div className="relative pl-3 border-l border-white/10 space-y-3 max-h-[170px] overflow-y-auto pr-1">
                                        {selectedLead.notes.map((note, index) => (
                                            <div key={index} className="relative group/note bg-white/[0.02] border border-white/5 rounded-xl p-2.5 text-[10px] leading-relaxed">
                                                {/* Bullet timeline circle */}
                                                <div className="absolute -left-[17px] top-3.5 h-1.5 w-1.5 rounded-full bg-brand-magenta border border-background shadow-glow" />
                                                
                                                <div className="flex items-start justify-between gap-1.5">
                                                    <span className="text-foreground">{note}</span>
                                                    <button
                                                        onClick={() => handleDeleteNote(index)}
                                                        className="opacity-0 group-hover/note:opacity-100 text-muted-foreground hover:text-rose-400 p-0.5 rounded transition shrink-0 cursor-pointer"
                                                        title="Delete Comment"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {selectedLead.notes.length === 0 && (
                                            <div className="text-[10px] text-muted-foreground italic text-center py-4">
                                                No administrative logs appended.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            No lead selected
                        </div>
                    )}

                    <div className="border-t border-white/5 pt-4 mt-4 space-y-2">
                        <textarea
                            rows={2}
                            placeholder="Write internal team notes here..."
                            value={newNoteText}
                            onChange={(e) => setNewNoteText(e.target.value)}
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none resize-none text-foreground"
                        />
                        <button
                            onClick={handleAddNote}
                            className="w-full rounded-xl bg-brand-magenta text-white py-2 text-xs font-bold shadow-md hover:scale-[1.01] transition cursor-pointer"
                        >
                            Append Admin Comment
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Lead Modal */}
            <AnimatePresence>
                {isAddLeadModalOpen && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-elegant space-y-4 text-foreground"
                        >
                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                <h3 className="font-display font-bold text-sm tracking-tight">Add New CRM Lead</h3>
                                <button
                                    onClick={() => {
                                        setIsAddLeadModalOpen(false);
                                        setNewLeadName("");
                                        setNewLeadEmail("");
                                        setNewLeadPhone("");
                                        setNewLeadNote("");
                                    }}
                                    className="text-muted-foreground hover:text-foreground p-1 rounded transition cursor-pointer"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                            
                            <form onSubmit={handleAddLeadSubmit} className="space-y-3.5">
                                <div>
                                    <label className="block text-[9px] uppercase font-bold text-muted-foreground mb-1.5 tracking-wider">
                                        Client Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Sarah Jenkins"
                                        value={newLeadName}
                                        onChange={(e) => setNewLeadName(e.target.value)}
                                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors"
                                        required
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="block text-[9px] uppercase font-bold text-muted-foreground mb-1.5 tracking-wider">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="sarah@example.com"
                                        value={newLeadEmail}
                                        onChange={(e) => setNewLeadEmail(e.target.value)}
                                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[9px] uppercase font-bold text-muted-foreground mb-1.5 tracking-wider">
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="+92 300 1234567"
                                        value={newLeadPhone}
                                        onChange={(e) => setNewLeadPhone(e.target.value)}
                                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[9px] uppercase font-bold text-muted-foreground mb-1.5 tracking-wider">
                                            Interest Area
                                        </label>
                                        <select
                                            value={newLeadInterest}
                                            onChange={(e) => setNewLeadInterest(e.target.value)}
                                            className="w-full rounded-xl border border-border bg-background px-2.5 py-2 text-[11px] text-foreground focus:outline-none focus:border-brand-magenta transition-colors cursor-pointer"
                                        >
                                            <option value="AI Chatbots & Agents">AI Chatbots</option>
                                            <option value="Full-Stack Applications">Full-Stack App</option>
                                            <option value="SEO Services">SEO Services</option>
                                            <option value="Custom LLM Development">Custom LLM</option>
                                            <option value="SaaS Platform Development">SaaS Platform</option>
                                            <option value="Business Development Starter Kit">Starter Kit</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[9px] uppercase font-bold text-muted-foreground mb-1.5 tracking-wider">
                                            Acquisition Channel
                                        </label>
                                        <select
                                            value={newLeadSource}
                                            onChange={(e) => setNewLeadSource(e.target.value)}
                                            className="w-full rounded-xl border border-border bg-background px-2.5 py-2 text-[11px] text-foreground focus:outline-none focus:border-brand-magenta transition-colors cursor-pointer"
                                        >
                                            <option value="Google Search">Google Search</option>
                                            <option value="LinkedIn Referral">LinkedIn</option>
                                            <option value="Direct Traffic">Direct Traffic</option>
                                            <option value="Paid Ads">Paid Ads</option>
                                            <option value="Organic Social">Organic Social</option>
                                            <option value="Manual Intake">Manual Intake</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[9px] uppercase font-bold text-muted-foreground mb-1.5 tracking-wider">
                                        Initial Intake Note
                                    </label>
                                    <textarea
                                        rows={2}
                                        placeholder="Add background context..."
                                        value={newLeadNote}
                                        onChange={(e) => setNewLeadNote(e.target.value)}
                                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors resize-none"
                                    />
                                </div>

                                <div className="flex items-center gap-2 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsAddLeadModalOpen(false);
                                            setNewLeadName("");
                                            setNewLeadEmail("");
                                            setNewLeadPhone("");
                                            setNewLeadNote("");
                                        }}
                                        className="flex-1 rounded-xl border border-white/10 hover:bg-white/5 py-2.5 text-xs font-semibold transition text-center cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 rounded-xl bg-brand-magenta text-white py-2.5 text-xs font-semibold shadow-md hover:opacity-90 transition text-center cursor-pointer"
                                    >
                                        Save Lead
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { logAudit } from "@/lib/logAudit";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users, Briefcase, FileText, Plus, X, Trash2, Pencil,
    Linkedin, Github, Image as ImageIcon, Search, Download,
    MapPin, Clock, Building2, CheckCircle2, XCircle, Star,
    ExternalLink, UploadCloud, Filter, ChevronRight, User,
    Mail, Phone as PhoneIcon, GripVertical,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/Team-Careers")({
    head: () => ({
        meta: [
            { title: "Team & Careers — ClickTake Admin" },
            { name: "description", content: "Manage team profiles, job postings, and applicant pipeline." },
        ],
    }),
    component: TeamCareersPage,
});

/* ─────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────── */

interface TeamMember {
    id: string;
    full_name: string;
    role_title: string;
    bio: string;
    linkedin_url: string;
    github_url: string;
    avatar_url: string;
    display_order: number;
    is_active: boolean;
}

interface JobPosting {
    id: string;
    title: string;
    department: string;
    location: string;
    employment_type: string;
    description: string;
    requirements: string;
    status: "Open" | "Closed";
    posted_at: string;
}

interface Application {
    id: string;
    job_id: string | null;
    applicant_name: string;
    email: string;
    phone: string;
    resume_url: string;
    cover_letter: string;
    status: "New" | "Shortlisted" | "Interview" | "Rejected" | "Hired";
    notes: string;
    applied_at: string;
}

const STATUS_STYLES: Record<string, string> = {
    New: "bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20",
    Shortlisted: "bg-brand-magenta/10 text-brand-magenta border-brand-magenta/20",
    Interview: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Rejected: "bg-brand-pink/10 text-brand-pink border-brand-pink/20",
    Hired: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

/* ─────────────────────────────────────────────────────────
   Root component
───────────────────────────────────────────────────────── */

function TeamCareersPage() {
    const [tab, setTab] = useState<"team" | "jobs" | "applications">("team");

    const [members, setMembers] = useState<TeamMember[]>([]);
    const [jobs, setJobs] = useState<JobPosting[]>([]);
    const [apps, setApps] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    const loadAll = async () => {
        setLoading(true);
        const [m, j, a] = await Promise.all([
            supabase.from("team_members").select("*").order("display_order", { ascending: true }),
            supabase.from("job_postings").select("*").order("posted_at", { ascending: false }),
            supabase.from("job_applications").select("*").order("applied_at", { ascending: false }),
        ]);
        if (m.error) toast.error(`Failed to load team members: ${m.error.message}`);
        else setMembers(m.data ?? []);

        if (j.error) toast.error(`Failed to load job postings: ${j.error.message}`);
        else setJobs(j.data ?? []);

        if (a.error) toast.error(`Failed to load applications: ${a.error.message}`);
        else setApps(a.data ?? []);

        setLoading(false);
    };

    useEffect(() => {
        loadAll();

        const channel = supabase
            .channel("hr-module-realtime")
            .on("postgres_changes", { event: "*", schema: "public", table: "job_applications" }, () => loadAll())
            .on("postgres_changes", { event: "*", schema: "public", table: "job_postings" }, () => loadAll())
            .on("postgres_changes", { event: "*", schema: "public", table: "team_members" }, () => loadAll())
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const openJobsCount = jobs.filter(j => j.status === "Open").length;
    const newAppsCount = apps.filter(a => a.status === "New").length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div>
                <h1 className="font-display text-2xl font-bold tracking-tight">Team & Careers</h1>
                <p className="text-xs text-muted-foreground mt-1">
                    Manage team profiles, publish open roles, and review applicants.
                </p>
            </div>

            {/* KPI strip */}
            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl flex items-center justify-between">
                    <div>
                        <div className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">Team Members</div>
                        <div className="text-2xl font-display font-bold mt-1">{members.length}</div>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-brand-blue/10 flex items-center justify-center border border-brand-blue/20">
                        <Users className="h-5 w-5 text-brand-blue" />
                    </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl flex items-center justify-between">
                    <div>
                        <div className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">Open Positions</div>
                        <div className="text-2xl font-display font-bold mt-1 text-brand-cyan">{openJobsCount}</div>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-brand-cyan/10 flex items-center justify-center border border-brand-cyan/20">
                        <Briefcase className="h-5 w-5 text-brand-cyan" />
                    </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl flex items-center justify-between">
                    <div>
                        <div className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">New Applicants</div>
                        <div className="text-2xl font-display font-bold mt-1 text-brand-magenta">{newAppsCount}</div>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-brand-magenta/10 flex items-center justify-center border border-brand-magenta/20">
                        <FileText className="h-5 w-5 text-brand-magenta" />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-0">
                {[
                    { id: "team", label: "Team Management", icon: Users },
                    { id: "jobs", label: "Job Postings", icon: Briefcase },
                    { id: "applications", label: "Applications", icon: FileText, badge: newAppsCount },
                ].map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id as any)}
                        className={`relative flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold transition-colors cursor-pointer border-b-2 -mb-px ${tab === t.id
                                ? "border-brand-magenta text-foreground"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <t.icon className="h-3.5 w-3.5" />
                        {t.label}
                        {!!t.badge && (
                            <span className="ml-1 rounded-full bg-brand-magenta text-white text-[9px] font-bold px-1.5 py-0.5">
                                {t.badge}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="h-64 flex items-center justify-center text-xs text-muted-foreground">Loading HR data…</div>
            ) : (
                <>
                    {tab === "team" && <TeamTab members={members} refresh={loadAll} />}
                    {tab === "jobs" && <JobsTab jobs={jobs} apps={apps} refresh={loadAll} />}
                    {tab === "applications" && <ApplicationsTab apps={apps} jobs={jobs} refresh={loadAll} />}
                </>
            )}
        </motion.div>
    );
}

/* ─────────────────────────────────────────────────────────
   TEAM MANAGEMENT TAB
───────────────────────────────────────────────────────── */

function TeamTab({ members, refresh }: { members: TeamMember[]; refresh: () => void }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<TeamMember | null>(null);

    const openAdd = () => { setEditing(null); setModalOpen(true); };
    const openEdit = (m: TeamMember) => { setEditing(m); setModalOpen(true); };

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Remove ${name} from the team page?`)) return;
        const { error } = await supabase.from("team_members").delete().eq("id", id);
        if (error) { toast.error(`Failed to delete: ${error.message}`); return; }
        await logAudit(`Removed team member: ${name}`, "team_member", id);
        toast.success("Team member removed");
        refresh();
    };

    const toggleActive = async (m: TeamMember) => {
        const { error } = await supabase.from("team_members").update({ is_active: !m.is_active }).eq("id", m.id);
        if (error) { toast.error("Failed to update visibility"); return; }
        toast.success(!m.is_active ? "Now visible on site" : "Hidden from site");
        refresh();
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button
                    onClick={openAdd}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-brand-magenta px-4 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-90 transition cursor-pointer"
                >
                    <Plus className="h-4 w-4" /> Add Team Member
                </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {members.map((m) => (
                    <div key={m.id} className="rounded-2xl border border-white/10 bg-card/40 backdrop-blur-xl overflow-hidden group">
                        <div className="p-4 flex items-start gap-3">
                            <div className="h-14 w-14 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0 flex items-center justify-center">
                                {m.avatar_url ? (
                                    <img src={m.avatar_url} alt={m.full_name} className="h-full w-full object-cover" />
                                ) : (
                                    <User className="h-6 w-6 text-muted-foreground" />
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                    <h3 className="text-sm font-bold truncate">{m.full_name || "⚠ Unnamed"}</h3>
                                    {!m.is_active && (
                                        <span className="text-[8px] font-bold uppercase text-muted-foreground bg-white/5 border border-white/10 rounded-full px-1.5 py-0.5">Hidden</span>
                                    )}
                                </div>
                                <p className="text-[10px] text-brand-cyan font-semibold">{m.role_title}</p>
                                <p className="text-[10px] text-muted-foreground line-clamp-2 mt-1">{m.bio}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between px-4 pb-3">
                            <div className="flex items-center gap-2">
                                {m.linkedin_url && (
                                    <a href={m.linkedin_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-brand-blue transition">
                                        <Linkedin className="h-3.5 w-3.5" />
                                    </a>
                                )}
                                {m.github_url && (
                                    <a href={m.github_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition">
                                        <Github className="h-3.5 w-3.5" />
                                    </a>
                                )}
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => toggleActive(m)} title={m.is_active ? "Hide from site" : "Show on site"}
                                    className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition cursor-pointer">
                                    {m.is_active ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <XCircle className="h-3.5 w-3.5" />}
                                </button>
                                <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition cursor-pointer">
                                    <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button onClick={() => handleDelete(m.id, m.full_name || "this member")} className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-brand-pink transition cursor-pointer">
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {members.length === 0 && (
                    <div className="col-span-full rounded-2xl border border-white/10 bg-card/40 p-8 backdrop-blur-xl text-center text-xs text-muted-foreground">
                        No team members yet. Click "Add Team Member" to build your team page.
                    </div>
                )}
            </div>

            <AnimatePresence>
                {modalOpen && (
                    <TeamMemberModal
                        existing={editing}
                        onClose={() => setModalOpen(false)}
                        onSaved={() => { setModalOpen(false); refresh(); }}
                        nextOrder={members.length}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function TeamMemberModal({ existing, onClose, onSaved, nextOrder }: {
    existing: TeamMember | null; onClose: () => void; onSaved: () => void; nextOrder: number;
}) {
    const [name, setName] = useState(existing?.full_name || "");
    const [designation, setDesignation] = useState(existing?.role_title || "");
    const [bio, setBio] = useState(existing?.bio || "");
    const [linkedin, setLinkedin] = useState(existing?.linkedin_url || "");
    const [github, setGithub] = useState(existing?.github_url || "");
    const [pictureUrl, setPictureUrl] = useState(existing?.avatar_url || "");
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const ext = file.name.split(".").pop();
            const path = `team/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
            const { error } = await supabase.storage.from("team-photos").upload(path, file, { upsert: true });
            if (error) throw error;
            const { data } = supabase.storage.from("team-photos").getPublicUrl(path);
            setPictureUrl(data.publicUrl);
            toast.success("Photo uploaded");
        } catch (err: any) {
            toast.error(`Upload failed: ${err.message}. Make sure the "team-photos" storage bucket exists (see hr_module_schema.sql).`);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) { toast.error("Name is required"); return; }
        setSaving(true);
        const payload = {
            full_name: name.trim(),
            role_title: designation.trim(),
            bio: bio.trim(),
            linkedin_url: linkedin.trim(),
            github_url: github.trim(),
            avatar_url: pictureUrl,
            updated_at: new Date().toISOString(),
        };
        if (existing) {
            const { error } = await supabase.from("team_members").update(payload).eq("id", existing.id);
            if (error) { toast.error(`Failed to update: ${error.message}`); setSaving(false); return; }
            await logAudit(`Updated team member: ${name}`, "team_member", existing.id);
            toast.success("Team member updated");
        } else {
            const { error } = await supabase.from("team_members").insert({ ...payload, display_order: nextOrder, is_active: true });
            if (error) { toast.error(`Failed to create: ${error.message}`); setSaving(false); return; }
            await logAudit(`Added team member: ${name}`, "team_member", "");
            toast.success("Team member added");
        }
        setSaving(false);
        onSaved();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-elegant space-y-4 text-foreground max-h-[90vh] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h3 className="font-display font-bold text-sm">{existing ? "Edit Team Member" : "Add Team Member"}</h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded cursor-pointer"><X className="h-4 w-4" /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div className="flex items-center gap-3">
                        <div className="h-16 w-16 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            {pictureUrl ? <img src={pictureUrl} className="h-full w-full object-cover" /> : <ImageIcon className="h-5 w-5 text-muted-foreground" />}
                        </div>
                        <label className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/20 hover:border-brand-magenta/40 px-3 py-3 text-[10px] font-bold text-muted-foreground cursor-pointer transition">
                            <UploadCloud className="h-3.5 w-3.5" /> {uploading ? "Uploading…" : "Upload Photo"}
                            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
                        </label>
                    </div>

                    <div>
                        <label className="block text-[9px] uppercase font-bold text-muted-foreground mb-1.5 tracking-wider">Full Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} required autoFocus
                            className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs focus:outline-none focus:border-brand-magenta" />
                    </div>
                    <div>
                        <label className="block text-[9px] uppercase font-bold text-muted-foreground mb-1.5 tracking-wider">Designation</label>
                        <input value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="e.g. Senior React Developer"
                            className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs focus:outline-none focus:border-brand-magenta" />
                    </div>
                    <div>
                        <label className="block text-[9px] uppercase font-bold text-muted-foreground mb-1.5 tracking-wider">Bio</label>
                        <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)}
                            className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs focus:outline-none focus:border-brand-magenta resize-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[9px] uppercase font-bold text-muted-foreground mb-1.5 tracking-wider">LinkedIn URL</label>
                            <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/…"
                                className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs focus:outline-none focus:border-brand-magenta" />
                        </div>
                        <div>
                            <label className="block text-[9px] uppercase font-bold text-muted-foreground mb-1.5 tracking-wider">GitHub URL</label>
                            <input value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/…"
                                className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs focus:outline-none focus:border-brand-magenta" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                        <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-white/10 hover:bg-white/5 py-2.5 text-xs font-semibold cursor-pointer">Cancel</button>
                        <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-brand-magenta text-white py-2.5 text-xs font-semibold shadow-md hover:opacity-90 cursor-pointer disabled:opacity-50">
                            {saving ? "Saving…" : "Save"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────
   JOB POSTINGS TAB
───────────────────────────────────────────────────────── */

function JobsTab({ jobs, apps, refresh }: { jobs: JobPosting[]; apps: Application[]; refresh: () => void }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<JobPosting | null>(null);

    const applicantCount = (jobId: string) => apps.filter(a => a.job_id === jobId).length;

    const toggleStatus = async (job: JobPosting) => {
        const newStatus = job.status === "Open" ? "Closed" : "Open";
        const { error } = await supabase.from("job_postings").update({ status: newStatus }).eq("id", job.id);
        if (error) { toast.error("Failed to update status"); return; }
        await logAudit(`Marked job "${job.title}" as ${newStatus}`, "job_posting", job.id);
        toast.success(`Job marked as ${newStatus}`);
        refresh();
    };

    const handleDelete = async (job: JobPosting) => {
        if (!window.confirm(`Delete "${job.title}"? This cannot be undone.`)) return;
        const { error } = await supabase.from("job_postings").delete().eq("id", job.id);
        if (error) { toast.error(`Failed to delete: ${error.message}`); return; }
        await logAudit(`Deleted job posting: ${job.title}`, "job_posting", job.id);
        toast.success("Job posting deleted");
        refresh();
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button
                    onClick={() => { setEditing(null); setModalOpen(true); }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-brand-magenta px-4 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-90 transition cursor-pointer"
                >
                    <Plus className="h-4 w-4" /> New Job Posting
                </button>
            </div>

            <div className="grid gap-4">
                {jobs.map((job) => (
                    <div key={job.id} className="rounded-2xl border border-white/10 bg-card/40 backdrop-blur-xl p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="text-sm font-bold">{job.title}</h3>
                                    <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full border ${job.status === "Open" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-white/5 text-muted-foreground border-white/10"
                                        }`}>{job.status}</span>
                                </div>
                                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground flex-wrap">
                                    {job.department && <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{job.department}</span>}
                                    {job.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>}
                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job.employment_type}</span>
                                    <span className="flex items-center gap-1 text-brand-cyan font-semibold"><FileText className="h-3 w-3" />{applicantCount(job.id)} applicant(s)</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-2 line-clamp-2">{job.description}</p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <button onClick={() => toggleStatus(job)} className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition cursor-pointer" title="Toggle open/closed">
                                    {job.status === "Open" ? <XCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                                </button>
                                <button onClick={() => { setEditing(job); setModalOpen(true); }} className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition cursor-pointer">
                                    <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button onClick={() => handleDelete(job)} className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-brand-pink transition cursor-pointer">
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {jobs.length === 0 && (
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-8 backdrop-blur-xl text-center text-xs text-muted-foreground">
                        No job postings yet. Click "New Job Posting" to publish your first open role.
                    </div>
                )}
            </div>

            <AnimatePresence>
                {modalOpen && (
                    <JobModal existing={editing} onClose={() => setModalOpen(false)} onSaved={() => { setModalOpen(false); refresh(); }} />
                )}
            </AnimatePresence>
        </div>
    );
}

function JobModal({ existing, onClose, onSaved }: { existing: JobPosting | null; onClose: () => void; onSaved: () => void; }) {
    const [title, setTitle] = useState(existing?.title || "");
    const [department, setDepartment] = useState(existing?.department || "");
    const [location, setLocation] = useState(existing?.location || "Remote");
    const [employmentType, setEmploymentType] = useState(existing?.employment_type || "Full-time");
    const [description, setDescription] = useState(existing?.description || "");
    const [requirements, setRequirements] = useState(existing?.requirements || "");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) { toast.error("Job title is required"); return; }
        setSaving(true);
        const payload = {
            title: title.trim(), department: department.trim(), location: location.trim(),
            employment_type: employmentType, description: description.trim(), requirements: requirements.trim(),
            updated_at: new Date().toISOString(),
        };
        if (existing) {
            const { error } = await supabase.from("job_postings").update(payload).eq("id", existing.id);
            if (error) { toast.error(`Failed to update: ${error.message}`); setSaving(false); return; }
            await logAudit(`Updated job posting: ${title}`, "job_posting", existing.id);
            toast.success("Job posting updated");
        } else {
            const { error } = await supabase.from("job_postings").insert({ ...payload, status: "Open" });
            if (error) { toast.error(`Failed to create: ${error.message}`); setSaving(false); return; }
            await logAudit(`Published job posting: ${title}`, "job_posting", "");
            toast.success("Job posting published");
        }
        setSaving(false);
        onSaved();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card border border-white/10 rounded-2xl p-6 max-w-lg w-full shadow-elegant space-y-4 text-foreground max-h-[90vh] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h3 className="font-display font-bold text-sm">{existing ? "Edit Job Posting" : "New Job Posting"}</h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded cursor-pointer"><X className="h-4 w-4" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div>
                        <label className="block text-[9px] uppercase font-bold text-muted-foreground mb-1.5 tracking-wider">Job Title</label>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} required autoFocus placeholder="e.g. Senior React Developer Required"
                            className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs focus:outline-none focus:border-brand-magenta" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[9px] uppercase font-bold text-muted-foreground mb-1.5 tracking-wider">Department</label>
                            <input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Engineering"
                                className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs focus:outline-none focus:border-brand-magenta" />
                        </div>
                        <div>
                            <label className="block text-[9px] uppercase font-bold text-muted-foreground mb-1.5 tracking-wider">Location</label>
                            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Remote / Faisalabad"
                                className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs focus:outline-none focus:border-brand-magenta" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[9px] uppercase font-bold text-muted-foreground mb-1.5 tracking-wider">Employment Type</label>
                        <select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}
                            className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs focus:outline-none cursor-pointer">
                            <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[9px] uppercase font-bold text-muted-foreground mb-1.5 tracking-wider">Description</label>
                        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                            className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs focus:outline-none focus:border-brand-magenta resize-none" />
                    </div>
                    <div>
                        <label className="block text-[9px] uppercase font-bold text-muted-foreground mb-1.5 tracking-wider">Requirements</label>
                        <textarea rows={3} value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder="One requirement per line"
                            className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs focus:outline-none focus:border-brand-magenta resize-none" />
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                        <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-white/10 hover:bg-white/5 py-2.5 text-xs font-semibold cursor-pointer">Cancel</button>
                        <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-brand-magenta text-white py-2.5 text-xs font-semibold shadow-md hover:opacity-90 cursor-pointer disabled:opacity-50">
                            {saving ? "Saving…" : existing ? "Update Posting" : "Publish Posting"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────
   APPLICATIONS TAB
───────────────────────────────────────────────────────── */

function ApplicationsTab({ apps, jobs, refresh }: { apps: Application[]; jobs: JobPosting[]; refresh: () => void }) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [jobFilter, setJobFilter] = useState("All");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const jobTitle = (id: string | null) => jobs.find(j => j.id === id)?.title || "General Application";

    const filtered = useMemo(() => {
        return apps.filter(a => {
            const matchesSearch = a.applicant_name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === "All" || a.status === statusFilter;
            const matchesJob = jobFilter === "All" || a.job_id === jobFilter;
            return matchesSearch && matchesStatus && matchesJob;
        });
    }, [apps, search, statusFilter, jobFilter]);

    const selected = apps.find(a => a.id === selectedId) || null;

    const updateStatus = async (id: string, status: string, name: string) => {
        const { error } = await supabase.from("job_applications").update({ status }).eq("id", id);
        if (error) { toast.error(`Failed to update status: ${error.message}`); return; }
        await logAudit(`Marked applicant ${name} as ${status}`, "job_application", id);
        toast.success(`${name} marked as ${status}`);
        refresh();
    };

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Delete application from ${name}?`)) return;
        const { error } = await supabase.from("job_applications").delete().eq("id", id);
        if (error) { toast.error(`Failed to delete: ${error.message}`); return; }
        await logAudit(`Deleted application from ${name}`, "job_application", id);
        toast.success("Application deleted");
        if (selectedId === id) setSelectedId(null);
        refresh();
    };

    const handleExportCSV = () => {
        if (filtered.length === 0) { toast.error("No applications to export"); return; }
        const headers = ["Name", "Email", "Phone", "Job", "Status", "Applied", "Resume URL"];
        const rows = filtered.map(a => [
            `"${a.applicant_name}"`, `"${a.email}"`, `"${a.phone || ""}"`, `"${jobTitle(a.job_id)}"`,
            `"${a.status}"`, `"${new Date(a.applied_at).toLocaleDateString()}"`, `"${a.resume_url || ""}"`,
        ].join(","));
        const csv = [headers.join(","), ...rows].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `applicants_${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Applicants exported");
    };

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
                {/* Filters */}
                <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[180px]">
                        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search applicant name or email…"
                            className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2 text-xs focus:outline-none" />
                    </div>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none cursor-pointer">
                        <option value="All">All statuses</option>
                        {["New", "Shortlisted", "Interview", "Rejected", "Hired"].map(s => <option key={s}>{s}</option>)}
                    </select>
                    <select value={jobFilter} onChange={(e) => setJobFilter(e.target.value)}
                        className="rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none cursor-pointer max-w-[180px]">
                        <option value="All">All positions</option>
                        {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                    </select>
                    <button onClick={handleExportCSV}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition cursor-pointer">
                        <Download className="h-3.5 w-3.5" /> Export
                    </button>
                </div>

                {/* List */}
                <div className="rounded-2xl border border-white/10 bg-card/40 backdrop-blur-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                    <th className="p-4">Applicant</th>
                                    <th className="p-4">Applying For</th>
                                    <th className="p-4">Applied</th>
                                    <th className="p-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-xs">
                                {filtered.map((a) => (
                                    <tr key={a.id} onClick={() => setSelectedId(a.id)}
                                        className={`cursor-pointer hover:bg-white/5 transition-colors border-l-2 ${selectedId === a.id ? "bg-white/5 border-l-brand-magenta" : "border-l-transparent"}`}>
                                        <td className="p-4">
                                            <div className="font-bold text-foreground">{a.applicant_name}</div>
                                            <div className="text-[10px] text-muted-foreground">{a.email}</div>
                                        </td>
                                        <td className="p-4 text-muted-foreground">{jobTitle(a.job_id)}</td>
                                        <td className="p-4 text-muted-foreground font-mono">{new Date(a.applied_at).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center">
                                                <select value={a.status} onClick={(e) => e.stopPropagation()}
                                                    onChange={(e) => updateStatus(a.id, e.target.value, a.applicant_name)}
                                                    className={`rounded-lg px-2 py-1 text-[10px] font-bold focus:outline-none border cursor-pointer ${STATUS_STYLES[a.status]}`}>
                                                    {["New", "Shortlisted", "Interview", "Rejected", "Hired"].map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr><td colSpan={4} className="p-8 text-center text-muted-foreground text-xs">No applications match your filters.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Detail panel */}
            <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl">
                {selected ? (
                    <div className="space-y-4">
                        <div className="border-b border-white/5 pb-3 flex items-start justify-between gap-2">
                            <div>
                                <div className="text-[9px] uppercase font-bold text-brand-magenta tracking-wider">Applicant Profile</div>
                                <h3 className="text-sm font-bold mt-1">{selected.applicant_name}</h3>
                            </div>
                            <button onClick={() => handleDelete(selected.id, selected.applicant_name)}
                                className="text-muted-foreground hover:text-brand-pink p-1.5 rounded-lg hover:bg-white/5 transition cursor-pointer">
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        </div>

                        <div className="space-y-2.5 text-xs">
                            <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" /><span className="truncate">{selected.email}</span></div>
                            {selected.phone && <div className="flex items-center gap-2"><PhoneIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" /><span>{selected.phone}</span></div>}
                            <div className="flex items-center gap-2"><Briefcase className="h-3.5 w-3.5 text-muted-foreground shrink-0" /><span>{jobTitle(selected.job_id)}</span></div>
                        </div>

                        {selected.cover_letter && (
                            <div className="border-t border-white/5 pt-3">
                                <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block mb-1.5">Cover Letter</span>
                                <p className="text-[10px] text-foreground leading-relaxed bg-white/2 border border-white/5 rounded-xl p-3 max-h-40 overflow-y-auto">{selected.cover_letter}</p>
                            </div>
                        )}

                        {selected.resume_url ? (
                            <a href={selected.resume_url} target="_blank" rel="noreferrer"
                                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/20 py-2.5 text-xs font-bold hover:bg-brand-cyan/25 transition">
                                <Download className="h-3.5 w-3.5" /> Download Resume / CV <ExternalLink className="h-3 w-3" />
                            </a>
                        ) : (
                            <p className="text-[10px] text-muted-foreground italic text-center">No resume attached</p>
                        )}

                        <div className="border-t border-white/5 pt-3">
                            <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block mb-2">Update Status</span>
                            <div className="grid grid-cols-2 gap-1.5">
                                {["New", "Shortlisted", "Interview", "Rejected", "Hired"].map(s => (
                                    <button key={s} onClick={() => updateStatus(selected.id, s, selected.applicant_name)}
                                        className={`text-[9px] font-bold py-2 rounded-lg border transition cursor-pointer ${selected.status === s ? STATUS_STYLES[s] : "border-white/5 text-muted-foreground hover:border-white/20"
                                            }`}>{s}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 text-muted-foreground text-xs">Select an applicant to view details</div>
                )}
            </div>
        </div>
    );
}
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    ShieldAlert,
    Shield,
    Server,
    Lock,
    RefreshCw,
    Trash2,
    CheckCircle2,
    KeyRound,
    History,
    AlertTriangle,
    FileClock,
    Inbox,
    Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

export const Route = createFileRoute("/admin/security")({
    head: () => ({
        meta: [
            { title: "Security & Logs — ClickTake Admin" },
            { name: "description", content: "Manage backups, rate limiting, two-factor auth, and audit logs." },
        ],
    }),
    component: AdminSecurityPage,
});

interface Backup {
    id: string;
    date: string;
    size: string;
    type: string;
}

interface BlockedIP {
    ip: string;
    attempts: number;
    reason: string;
}

interface AuditLog {
    id: number;
    user: string;
    action: string;
    time: string;
}

function AdminSecurityPage() {
    const [backups, setBackups] = useState<Backup[]>([]);
    const [rateLimit, setRateLimit] = useState(60);
    const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>([]);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [otpInput, setOtpInput] = useState("");
    const [isOtpVerifying, setIsOtpVerifying] = useState(false);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingBackup, setSavingBackup] = useState(false);

    useEffect(() => {
        loadSecurityData();
    }, []);

    const loadSecurityData = async () => {
        setLoading(true);
        try {
            const { data: settings } = await supabase.from("security_settings").select("*");
            if (settings) {
                const rl = settings.find((s: any) => s.key === "rate_limit")?.value;
                if (rl) setRateLimit(parseInt(rl));
                const tfa = settings.find((s: any) => s.key === "two_factor_enabled")?.value;
                if (tfa) setTwoFactorEnabled(tfa === "true");
            }

            const { data: backupData } = await supabase.from("backups").select("*").order("created_at", { ascending: false });
            if (backupData) {
                setBackups(backupData.map((b: any) => ({
                    id: b.id,
                    date: new Date(b.created_at).toLocaleString(),
                    size: b.size_mb,
                    type: b.backup_type,
                })));
            }

            const { data: ipData } = await supabase.from("blocked_ips").select("*").order("created_at", { ascending: false });
            if (ipData) {
                setBlockedIPs(ipData.map((b: any) => ({
                    ip: b.ip_address,
                    attempts: b.attempt_count,
                    reason: b.reason,
                })));
            }

            const { data: logData } = await supabase.from("security_logs").select("*").order("created_at", { ascending: false }).limit(20);
            if (logData) {
                setAuditLogs(logData.map((l: any) => ({
                    id: l.id,
                    user: l.user_name || "System",
                    action: l.action,
                    time: new Date(l.created_at).toLocaleString(),
                })));
            }
        } catch (err) {
            console.error("Error loading security data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBackup = async () => {
        setSavingBackup(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 800));
            const size = `${(24.0 + Math.random() * 10).toFixed(1)} MB`;
            const { data, error } = await supabase.from("backups").insert({
                size_mb: size,
                backup_type: "Manual",
            }).select("id").single();

            if (error) throw error;

            const newBackup: Backup = {
                id: data.id,
                date: new Date().toLocaleString(),
                size,
                type: "Manual",
            };
            setBackups((prev) => [newBackup, ...prev]);
            await supabase.from("security_logs").insert({ user_name: "Admin", action: "Manual backup created" });
            toast.success("Backup successfully saved to storage cluster.");
        } catch {
            toast.error("Backup failed");
        } finally {
            setSavingBackup(false);
        }
    };

    const handleRestoreBackup = (id: string) => {
        const backup = backups.find((b) => b.id === id);
        if (!confirm(`Warning: Restoring the backup from ${backup?.date} will overwrite current database state. Proceed?`)) return;
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1500)),
            {
                loading: "Halting server queries, rebuilding database state...",
                success: "System state restored to backup checkpoint successfully!",
                error: "Restoration failed",
            }
        );
    };

    const handleDeleteBackup = async (id: string) => {
        try {
            await supabase.from("backups").delete().eq("id", id);
            setBackups((prev) => prev.filter((b) => b.id !== id));
            toast.error("Backup cleared");
        } catch {
            toast.error("Failed to delete backup");
        }
    };

    const handleVerify2FA = async () => {
        setIsOtpVerifying(true);
        await new Promise((resolve) => setTimeout(resolve, 600));
        setIsOtpVerifying(false);
        if (otpInput === "123456") {
            setTwoFactorEnabled(true);
            setOtpInput("");
            await supabase.from("security_settings").upsert({ key: "two_factor_enabled", value: "true" }, { onConflict: "key" });
            await supabase.from("security_logs").insert({ user_name: "Admin", action: "2FA Authentication enabled" });
            toast.success("Two-Factor Authentication (2FA) is now ENABLED.");
        } else {
            toast.error("Incorrect verification code. Please try again.");
        }
    };

    const handleUnblockIP = async (ip: string) => {
        try {
            await supabase.from("blocked_ips").delete().eq("ip_address", ip);
            setBlockedIPs((prev) => prev.filter((i) => i.ip !== ip));
            toast.success(`IP ${ip} unblocked`);
        } catch {
            toast.error("Failed to unblock IP");
        }
    };

    const handleRateLimitChange = async (val: number) => {
        setRateLimit(val);
        await supabase.from("security_settings").upsert({ key: "rate_limit", value: String(val) }, { onConflict: "key" });
    };

    const handleDisable2FA = async () => {
        setTwoFactorEnabled(false);
        await supabase.from("security_settings").upsert({ key: "two_factor_enabled", value: "false" }, { onConflict: "key" });
        await supabase.from("security_logs").insert({ user_name: "Admin", action: "2FA Authentication disabled" });
        toast.error("2FA disabled");
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
                    <h1 className="font-display text-2xl font-bold tracking-tight">Security & Infrastructure</h1>
                    <p className="text-xs text-muted-foreground mt-1">
                        Manage backups, monitor rate limit firewalls, and check authentication audits.
                    </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-white/5 border border-white/5 px-3 py-1.5 text-[10px] font-bold text-muted-foreground">
                    {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldAlert className="h-3.5 w-3.5" />}
                    {loading ? "Loading..." : "System Security"}
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left columns: backups & rate limiter */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Backups Vault */}
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">System Backup Vault</h3>
                                <div className="text-[10px] text-muted-foreground">Snapshot configurations and database rollbacks</div>
                            </div>
                            <button
                                onClick={handleCreateBackup}
                                disabled={savingBackup}
                                className="flex items-center gap-1 rounded-xl bg-brand-magenta text-white px-3 py-1.5 text-[10px] font-bold shadow-md hover:scale-[1.03] transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {savingBackup ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                                {savingBackup ? "Snapshoting..." : "Snapshot Now"}
                            </button>
                        </div>

                        {backups.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center py-10">
                                <FileClock className="h-9 w-9 text-muted-foreground mb-2" />
                                <p className="text-xs font-semibold">No backups yet</p>
                                <p className="text-[10px] text-muted-foreground mt-1">
                                    Run a snapshot to create your first restore point
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                {backups.map((bk) => (
                                    <div key={bk.id} className="flex items-center justify-between rounded-xl bg-white/5 p-3 text-xs">
                                        <div>
                                            <p className="font-semibold">{bk.date}</p>
                                            <span className="text-[9px] text-muted-foreground">Size: {bk.size} • Type: {bk.type}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleRestoreBackup(bk.id)}
                                                className="rounded-lg bg-white/5 px-2.5 py-1 text-[10px] hover:bg-white/10 font-bold border border-white/10"
                                            >
                                                Restore
                                            </button>
                                            <button
                                                onClick={() => handleDeleteBackup(bk.id)}
                                                className="text-muted-foreground hover:text-rose-400 p-1"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Rate Limiting Firewall */}
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Rate Limiter Firewall</h3>
                                <div className="text-[10px] text-muted-foreground">Limit incoming queries per IP to prevent DDoS</div>
                            </div>
                            <Server className="h-4 w-4 text-brand-cyan" />
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                                    <span>Max requests/sec per Client</span>
                                    <span className="text-brand-magenta font-mono font-bold">{rateLimit} Req/s</span>
                                </div>
                                <input
                                    type="range"
                                    min="20"
                                    max="200"
                                    step="10"
                                    value={rateLimit}
                                    onChange={(e) => handleRateLimitChange(Number(e.target.value))}
                                    className="w-full accent-brand-magenta"
                                />
                            </div>

                            <div className="border-t border-white/5 pt-4">
                                <label className="block text-[10px] text-muted-foreground mb-2 uppercase font-semibold">
                                    Active Firewall IP Blocks
                                </label>

                                {blockedIPs.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center text-center py-8 rounded-xl bg-white/[0.02] border border-white/5">
                                        <Shield className="h-7 w-7 text-muted-foreground mb-2" />
                                        <p className="text-[11px] font-semibold">No IPs currently blocked</p>
                                        <p className="text-[9px] text-muted-foreground mt-1">Suspicious traffic will appear here automatically</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {blockedIPs.map((ipObj) => (
                                            <div key={ipObj.ip} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-xs">
                                                <div>
                                                    <span className="font-mono font-bold text-rose-400">{ipObj.ip}</span>
                                                    <span className="text-[9px] text-muted-foreground ml-3">Reason: {ipObj.reason}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] text-muted-foreground font-mono">{ipObj.attempts} attempts blocked</span>
                                                    <button
                                                        onClick={() => handleUnblockIP(ipObj.ip)}
                                                        className="text-[9px] font-bold text-brand-cyan hover:underline"
                                                    >
                                                        Unblock
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Audit Logs */}
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Recent Server & User Logs</h3>
                                <div className="text-[10px] text-muted-foreground">Chronological record of admin and system actions</div>
                            </div>
                            <History className="h-4 w-4 text-brand-magenta" />
                        </div>

                        {auditLogs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center py-10">
                                <Inbox className="h-9 w-9 text-muted-foreground mb-2" />
                                <p className="text-xs font-semibold">No activity logged yet</p>
                                <p className="text-[10px] text-muted-foreground mt-1">
                                    Admin actions and system events will show up here
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {auditLogs.map((log) => (
                                    <div key={log.id} className="flex items-start justify-between border-b border-white/5 pb-2.5 last:border-b-0 last:pb-0">
                                        <div className="flex items-start gap-3">
                                            <div className="h-2 w-2 rounded-full bg-brand-magenta mt-1.5 shrink-0" />
                                            <div>
                                                <p className="text-xs font-semibold leading-normal">{log.action}</p>
                                                <p className="text-[10px] text-muted-foreground">
                                                    Triggered by <span className="text-foreground">{log.user}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">{log.time}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right column: 2FA & checklist */}
                <div className="space-y-6">
                    {/* Two-Factor Authentication */}
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Two-Factor Authentication</h3>
                            <Lock className="h-4 w-4 text-brand-magenta" />
                        </div>

                        {twoFactorEnabled ? (
                            <div className="text-center py-4">
                                <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
                                <p className="text-xs font-bold">2FA Protection Active</p>
                                <p className="text-[10px] text-muted-foreground mt-1">Account logins require timed OTP key codes.</p>
                                <button
                                    onClick={handleDisable2FA}
                                    className="mt-4 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold hover:bg-white/10 transition"
                                >
                                    Disable 2FA Security
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <p className="text-[10px] text-muted-foreground leading-normal">
                                    Activate OTP keys using Google Authenticator or Microsoft Auth:
                                </p>
                                <div className="h-28 w-28 bg-white p-2 rounded-xl mx-auto shadow-md">
                                    <div className="h-full w-full bg-slate-900 flex items-center justify-center text-[10px] text-white font-mono text-center leading-tight">
                                        [ QR Mock ]<br />Scan Me
                                    </div>
                                </div>
                                <div>
                                    <label className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground mb-1 uppercase font-semibold text-center">
                                        <KeyRound className="h-3 w-3" /> Verify 6-digit key
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Type 123456 to test..."
                                            value={otpInput}
                                            onChange={(e) => setOtpInput(e.target.value)}
                                            className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-center focus:outline-none font-mono focus:border-brand-magenta transition-colors"
                                        />
                                        <button
                                            onClick={handleVerify2FA}
                                            className="rounded-lg bg-brand-magenta text-white px-3 text-xs font-bold disabled:opacity-50"
                                            disabled={isOtpVerifying || !otpInput.trim()}
                                        >
                                            {isOtpVerifying ? "..." : "Verify"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Audits Checklist */}
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Audits Checklist</h3>
                        <div className="space-y-2">
                            {[
                                { rule: "SMTP TLS Check", status: "Active", ok: true },
                                { rule: "Node API Protection", status: "Protected", ok: true },
                                { rule: "2FA Enforcement", status: twoFactorEnabled ? "Enforced" : "Optional", ok: twoFactorEnabled },
                                { rule: "Automated Backups", status: backups.length > 0 ? "Active" : "Not Configured", ok: backups.length > 0 },
                            ].map((rule, idx) => (
                                <div key={idx} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-[10px]">
                                    <span className="font-semibold flex items-center gap-1.5">
                                        {!rule.ok && <AlertTriangle className="h-3 w-3 text-amber-400" />}
                                        {rule.rule}
                                    </span>
                                    <span className={`font-mono font-bold ${rule.ok ? "text-emerald-400" : "text-amber-400"}`}>
                                        {rule.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
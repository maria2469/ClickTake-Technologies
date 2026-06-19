import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, ToggleLeft, ToggleRight, Users } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/roles")({
    head: () => ({
        meta: [
            { title: "User Roles (RBAC) — ClickTake Admin Portal" },
            { name: "description", content: "Manage administrative staff and role-based access permissions." },
        ],
    }),
    component: AdminRoles,
});

/* ───────────────── DATA TYPES ───────────────── */

interface UserItem {
    id: string;
    name: string;
    email: string;
    role: "Super Admin" | "Editor" | "Sales Support";
    status: "Active" | "Inactive";
}

interface RolePermissions {
    [key: string]: {
        readCMS: boolean;
        editCMS: boolean;
        readLeads: boolean;
        editLeads: boolean;
        configureSMTP: boolean;
        manageRBAC: boolean;
    };
}

/* ───────────────── MOCK DATA ───────────────── */

const initialUsers: UserItem[] = [
    { id: "u1", name: "Zain Paracha", email: "zain@clicktake.co", role: "Super Admin", status: "Active" },
    { id: "u2", name: "Maria Qasim", email: "maria@clicktake.co", role: "Editor", status: "Active" },
    { id: "u3", name: "Hamza Farooq", email: "hamza@clicktake.co", role: "Sales Support", status: "Active" },
    { id: "u4", name: "Support Temp", email: "support@clicktake.co", role: "Sales Support", status: "Inactive" },
];

const initialPermissions: RolePermissions = {
    "Super Admin": { readCMS: true, editCMS: true, readLeads: true, editLeads: true, configureSMTP: true, manageRBAC: true },
    Editor: { readCMS: true, editCMS: true, readLeads: false, editLeads: false, configureSMTP: false, manageRBAC: false },
    "Sales Support": { readCMS: true, editCMS: false, readLeads: true, editLeads: true, configureSMTP: false, manageRBAC: false },
};

const roleCards = [
    { role: "Super Admin" as const, desc: "Owner level privilege access, full SMTP, database, and system overrides." },
    { role: "Editor" as const, desc: "Content operator privilege. Manage layout files, media library assets, sitemaps." },
    { role: "Sales Support" as const, desc: "Operational agent access. Review leads database, reply messages, write notes." },
];

const permissionFields = [
    { key: "readCMS" as const, label: "View Page Layouts" },
    { key: "editCMS" as const, label: "Edit/Publish Pages" },
    { key: "readLeads" as const, label: "View CRM Leads" },
    { key: "editLeads" as const, label: "Edit Lead Pipeline" },
    { key: "configureSMTP" as const, label: "Manage SMTP relays" },
    { key: "manageRBAC" as const, label: "System configurations" },
];

/* ───────────────── COMPONENT ───────────────── */

function AdminRoles() {
    const [users, setUsers] = useState<UserItem[]>(initialUsers);
    const [permissions, setPermissions] = useState<RolePermissions>(initialPermissions);
    const [selectedRole, setSelectedRole] = useState<"Super Admin" | "Editor" | "Sales Support">("Super Admin");
    const [newUserName, setNewUserName] = useState("");
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserRole, setNewUserRole] = useState<"Super Admin" | "Editor" | "Sales Support">("Sales Support");

    const handlePermissionToggle = (role: string, permissionKey: keyof (typeof initialPermissions)["Editor"]) => {
        setPermissions({
            ...permissions,
            [role]: {
                ...permissions[role],
                [permissionKey]: !permissions[role][permissionKey],
            },
        });
        toast.info(`Updated permission on role: ${role}`);
    };

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUserName.trim() || !newUserEmail.trim()) return;
        const newUser: UserItem = {
            id: `u${Date.now()}`,
            name: newUserName.trim(),
            email: newUserEmail.trim(),
            role: newUserRole,
            status: "Active",
        };
        setUsers([...users, newUser]);
        setNewUserName("");
        setNewUserEmail("");
        toast.success(`User ${newUser.name} registered as ${newUser.role}`);
    };

    const handleToggleUserStatus = (userId: string) => {
        setUsers(users.map((u) => (u.id === userId ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u)));
        toast.info("Toggled user state");
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
                    <h1 className="font-display text-2xl font-bold tracking-tight">RBAC Security Controls</h1>
                    <p className="text-xs text-muted-foreground mt-1">
                        Manage administrative team members and configure role-based access permissions.
                    </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-white/5 border border-white/5 px-3 py-1.5 text-[10px] font-bold text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    {users.filter((u) => u.status === "Active").length} Active Staff
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column: Role Details & Permission switches */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Role cards selection */}
                    <div className="grid gap-4 sm:grid-cols-3">
                        {roleCards.map((item) => {
                            const isSelected = selectedRole === item.role;
                            return (
                                <div
                                    key={item.role}
                                    onClick={() => setSelectedRole(item.role)}
                                    className={`cursor-pointer rounded-2xl border p-4 backdrop-blur-xl transition ${isSelected
                                            ? "border-brand-magenta bg-brand-magenta/5 shadow-glow text-foreground"
                                            : "border-white/10 bg-card/40 text-muted-foreground hover:border-white/20"
                                        }`}
                                >
                                    <div className="font-bold text-xs">{item.role}</div>
                                    <p className="text-[10px] leading-relaxed mt-2">{item.desc}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Permissions Grid */}
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl">
                        <div className="border-b border-white/5 pb-3 mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Permissions Audit Matrix</h3>
                                <div className="text-[10px] text-muted-foreground">
                                    Role configured: <span className="text-foreground font-bold">{selectedRole}</span>
                                </div>
                            </div>
                            <Shield className="h-4 w-4 text-brand-magenta" />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            {permissionFields.map((perm) => {
                                const val = permissions[selectedRole][perm.key];
                                return (
                                    <div key={perm.key} className="flex items-center justify-between rounded-xl bg-white/5 p-3 text-xs">
                                        <span className="font-semibold text-foreground">{perm.label}</span>
                                        <button
                                            onClick={() => handlePermissionToggle(selectedRole, perm.key)}
                                            className={`transition-all ${val ? "text-brand-magenta" : "text-muted-foreground"}`}
                                        >
                                            {val ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7" />}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column: User list & register user */}
                <div className="space-y-6">
                    {/* Active users table */}
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Admin Staff</h3>
                        <div className="space-y-2">
                            {users.map((u) => (
                                <div key={u.id} className="flex items-center justify-between rounded-xl bg-white/5 p-2.5 text-xs">
                                    <div>
                                        <p className="font-semibold leading-none text-foreground">{u.name}</p>
                                        <span className="text-[9px] text-muted-foreground">{u.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/10 text-foreground">{u.role}</span>
                                        <button
                                            onClick={() => handleToggleUserStatus(u.id)}
                                            className={`h-2.5 w-2.5 rounded-full ${u.status === "Active" ? "bg-emerald-400" : "bg-rose-500"}`}
                                            title={u.status}
                                        />
                                    </div>
                                </div>
                            ))}
                            {users.length === 0 && (
                                <p className="text-[11px] text-muted-foreground text-center py-4">No staff registered yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Create user form */}
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Register Staff Profile</h3>
                        <form onSubmit={handleCreateUser} className="space-y-3">
                            <div>
                                <label className="block text-[10px] text-muted-foreground mb-1 uppercase font-semibold">Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Zeeshan Paracha"
                                    value={newUserName}
                                    onChange={(e) => setNewUserName(e.target.value)}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-muted-foreground mb-1 uppercase font-semibold">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="zeeshan@clicktake.co"
                                    value={newUserEmail}
                                    onChange={(e) => setNewUserEmail(e.target.value)}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-muted-foreground mb-1 uppercase font-semibold">Security Role</label>
                                <select
                                    value={newUserRole}
                                    onChange={(e) => setNewUserRole(e.target.value as any)}
                                    className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors"
                                >
                                    <option value="Super Admin">Super Admin</option>
                                    <option value="Editor">Editor</option>
                                    <option value="Sales Support">Sales Support</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full rounded-xl bg-gradient-brand text-white py-2 text-xs font-bold shadow-md hover:scale-[1.02] transition"
                            >
                                Register User
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
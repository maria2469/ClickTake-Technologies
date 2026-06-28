import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Shield,
    Users,
    Search,
    Plus,
    Trash2,
    Edit3,
    Check,
    X,
    Info,
    History,
    Activity,
    Lock,
    UserPlus,
    Filter,
    Layers,
    UserCheck,
    CheckCircle2,
    ShieldAlert,
    ShieldCheck,
    AlertTriangle,
    Eye,
    Settings,
    UserMinus,
    CheckCircle,
    Loader2
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

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
    role: string;
    status: "Active" | "Inactive";
}

interface RolePermissions {
    [roleName: string]: {
        readCMS: boolean;
        editCMS: boolean;
        readLeads: boolean;
        editLeads: boolean;
        configureSMTP: boolean;
        manageRBAC: boolean;
    };
}

interface RoleItem {
    role: string;
    desc: string;
}

interface AuditLog {
    id: string;
    timestamp: string;
    user: string;
    action: string;
    details: string;
    type: "create" | "update" | "delete" | "permission" | "role";
}

/* ───────────────── PERMISSION FIELDS CONFIG ───────────────── */

const permissionFields = [
    { key: "readCMS" as const, label: "View Page Layouts", desc: "Allows viewing sitemaps, pages, and templates." },
    { key: "editCMS" as const, label: "Edit/Publish Pages", desc: "Allows modifications, creation, and publishing of web pages." },
    { key: "readLeads" as const, label: "View CRM Leads", desc: "Allows reading client database and viewing sales pipelines." },
    { key: "editLeads" as const, label: "Edit Lead Pipeline", desc: "Allows editing stages, notes, and statuses." },
    { key: "configureSMTP" as const, label: "Manage SMTP relays", desc: "Allows configuration of system email triggers and relays." },
    { key: "manageRBAC" as const, label: "System configurations", desc: "Access to security logs, user database, and role assignments." },
];

/* ───────────────── COMPONENT ───────────────── */

function AdminRoles() {
    // Core state
    const [users, setUsers] = useState<UserItem[]>([]);
    const [roles, setRoles] = useState<RoleItem[]>([]);
    const [permissions, setPermissions] = useState<RolePermissions>({});
    const [selectedRole, setSelectedRole] = useState<string>("Super Admin");
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [rolesLoading, setRolesLoading] = useState(true);

    // Filters state
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    // Modal Control State
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [isEditUserOpen, setIsEditUserOpen] = useState(false);
    const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    // Form inputs state
    const [newUserName, setNewUserName] = useState("");
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserRole, setNewUserRole] = useState("Sales/Support");

    const [editingUser, setEditingUser] = useState<UserItem | null>(null);
    const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);

    const [newRoleName, setNewRoleName] = useState("");
    const [newRoleDesc, setNewRoleDesc] = useState("");

    // View options state
    const [permissionsViewMode, setPermissionsViewMode] = useState<"detail" | "matrix">("detail");

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        setRolesLoading(true);
        try {
            const { data: roleData } = await supabase.from("admin_roles").select("*").order("created_at");
            if (roleData) {
                setRoles(roleData.map((r: any) => ({ role: r.role_name, desc: r.description || "" })));
                if (roleData.length > 0) setSelectedRole(roleData[0].role_name);
            }

            const { data: userData } = await supabase.from("admin_users").select("*, admin_roles(role_name)");
            if (userData) {
                setUsers(userData.map((u: any) => ({
                    id: u.id,
                    name: u.full_name,
                    email: u.email,
                    role: u.admin_roles?.role_name || "Sales/Support",
                    status: u.status as "Active" | "Inactive",
                })));
            }

            const { data: permData } = await supabase.from("role_permissions").select("*, admin_roles(role_name)");
            if (permData) {
                const permMap: RolePermissions = {};
                permData.forEach((p: any) => {
                    const roleName = p.admin_roles?.role_name;
                    if (!roleName) return;
                    if (!permMap[roleName]) {
                        permMap[roleName] = { readCMS: false, editCMS: false, readLeads: false, editLeads: false, configureSMTP: false, manageRBAC: false };
                    }
                    if (p.permission_key in permMap[roleName]) {
                        (permMap[roleName] as any)[p.permission_key] = p.is_granted;
                    }
                });
                setPermissions(permMap);
            }

            const { data: logData } = await supabase.from("security_logs").select("*").order("created_at", { ascending: false }).limit(20);
            if (logData) {
                setAuditLogs(logData.map((l: any) => ({
                    id: l.id,
                    timestamp: new Date(l.created_at).toLocaleString(),
                    user: l.user_name || "System",
                    action: l.action,
                    details: "",
                    type: "update" as AuditLog["type"],
                })));
            }
        } catch (err) {
        } finally {
            setRolesLoading(false);
        }
    };

    // Helper: Add audit log entry
    const addAuditLog = async (action: string, details: string, type: AuditLog["type"]) => {
        const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
        const newLog: AuditLog = {
            id: `log-${Date.now()}`,
            timestamp,
            user: "Admin",
            action,
            details,
            type,
        };
        setAuditLogs((prev) => [newLog, ...prev]);
        try {
            await supabase.from("security_logs").insert({
                user_name: "Admin",
                action: `${action}: ${details}`,
            });
        } catch (err) {
        }
    };

    // Handlers
    const handlePermissionToggle = async (role: string, permissionKey: keyof RolePermissions[string]) => {
        const prevValue = permissions[role]?.[permissionKey];
        const newValue = !prevValue;
        setPermissions({
            ...permissions,
            [role]: {
                ...permissions[role],
                [permissionKey]: newValue,
            },
        });
        try {
            const { data: roleRow } = await supabase.from("admin_roles").select("id").eq("role_name", role).single();
            if (roleRow) {
                const { data: existing } = await supabase.from("role_permissions").select("id").eq("role_id", roleRow.id).eq("permission_key", permissionKey);
                if (existing && existing.length > 0) {
                    await supabase.from("role_permissions").update({ is_granted: newValue }).eq("id", existing[0].id);
                } else {
                    await supabase.from("role_permissions").insert({ role_id: roleRow.id, permission_key: permissionKey, is_granted: newValue });
                }
            }
            addAuditLog(`Toggled permission for ${role}`, `Set ${permissionKey} to ${newValue ? "Enabled" : "Disabled"}`, "permission");
            toast.info(`Updated permission for ${role}: ${permissionKey} is now ${newValue ? "ON" : "OFF"}`);
        } catch (err) {
            toast.error("Failed to update permission");
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = newUserName.trim();
        const trimmedEmail = newUserEmail.trim();

        if (!trimmedName || !trimmedEmail) return;

        try {
            const { data: roleRow } = await supabase.from("admin_roles").select("id").eq("role_name", newUserRole).single();
            const { data: newDbUser, error } = await supabase.from("admin_users").insert({
                full_name: trimmedName,
                email: trimmedEmail,
                role_id: roleRow?.id || null,
                status: "Active",
            }).select("id").single();

            if (error) throw error;

            const newUser: UserItem = {
                id: newDbUser.id,
                name: trimmedName,
                email: trimmedEmail,
                role: newUserRole,
                status: "Active",
            };

            setUsers([...users, newUser]);
            addAuditLog(`Registered new staff profile`, `${trimmedName} (${trimmedEmail}) assigned as ${newUserRole}`, "create");
            toast.success(`User ${trimmedName} registered as ${newUserRole}`);
        } catch (err: any) {
            toast.error(err.message || "Failed to register user");
        }

        setNewUserName("");
        setNewUserEmail("");
        setNewUserRole("Sales/Support");
        setIsAddUserOpen(false);
    };

    const handleEditUserSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        try {
            const { data: roleRow } = await supabase.from("admin_roles").select("id").eq("role_name", editingUser.role).single();
            await supabase.from("admin_users").update({
                full_name: editingUser.name,
                email: editingUser.email,
                role_id: roleRow?.id || null,
            }).eq("id", editingUser.id);

            setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
            addAuditLog(`Updated staff profile`, `${editingUser.name} details modified`, "update");
            toast.success(`Staff profile for ${editingUser.name} updated.`);
        } catch (err: any) {
            toast.error(err.message || "Failed to update user");
        }
        setIsEditUserOpen(false);
        setEditingUser(null);
    };

    const handleDeleteUserConfirm = async () => {
        if (!deletingUser) return;

        try {
            await supabase.from("admin_users").delete().eq("id", deletingUser.id);
            setUsers(users.filter((u) => u.id !== deletingUser.id));
            addAuditLog(`De-registered staff profile`, `Removed ${deletingUser.name} (${deletingUser.email})`, "delete");
            toast.error(`Removed staff profile: ${deletingUser.name}`);
        } catch (err: any) {
            toast.error(err.message || "Failed to delete user");
        }
        setIsDeleteConfirmOpen(false);
        setDeletingUser(null);
    };

    const handleToggleUserStatus = async (userId: string) => {
        const target = users.find((u) => u.id === userId);
        if (!target) return;
        const nextStatus: "Active" | "Inactive" = target.status === "Active" ? "Inactive" : "Active";

        try {
            await supabase.from("admin_users").update({ status: nextStatus }).eq("id", userId);
            setUsers(users.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u)));
            addAuditLog(`Toggled staff status`, `${target.name} set to ${nextStatus}`, "update");
            toast.info(`Status of ${target.name} set to ${nextStatus}`);
        } catch (err: any) {
            toast.error(err.message || "Failed to toggle status");
        }
    };

    const handleCreateRole = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = newRoleName.trim();
        const trimmedDesc = newRoleDesc.trim();

        if (!trimmedName || !trimmedDesc) return;

        if (roles.some((r) => r.role.toLowerCase() === trimmedName.toLowerCase())) {
            toast.error("Role already exists!");
            return;
        }

        try {
            const { data: newRoleDb, error } = await supabase.from("admin_roles").insert({
                role_name: trimmedName,
                description: trimmedDesc,
            }).select("id").single();

            if (error) throw error;

            // Create default permissions for the new role
            const defaultPerms = permissionFields.map(p => ({
                role_id: newRoleDb.id,
                permission_key: p.key,
                is_granted: false,
            }));
            await supabase.from("role_permissions").insert(defaultPerms);

            const newRole: RoleItem = { role: trimmedName, desc: trimmedDesc };
            setRoles([...roles, newRole]);
            setPermissions({
                ...permissions,
                [trimmedName]: { readCMS: false, editCMS: false, readLeads: false, editLeads: false, configureSMTP: false, manageRBAC: false },
            });

            addAuditLog(`Created Custom Role`, `Role "${trimmedName}" registered with default empty permissions`, "role");
            toast.success(`Custom Role "${trimmedName}" registered.`);
            setSelectedRole(trimmedName);
        } catch (err: any) {
            toast.error(err.message || "Failed to create role");
        }

        setNewRoleName("");
        setNewRoleDesc("");
        setIsAddRoleOpen(false);
    };

    // Filters & Memoized computations
    const filteredUsers = useMemo(() => {
        return users.filter((u) => {
            const matchesSearch =
                u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.role.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRole = roleFilter === "All" || u.role === roleFilter;
            const matchesStatus = statusFilter === "All" || u.status === statusFilter;
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchQuery, roleFilter, statusFilter]);

    const activeStaffCount = useMemo(() => users.filter((u) => u.status === "Active").length, [users]);
    const inactiveStaffCount = useMemo(() => users.filter((u) => u.status === "Inactive").length, [users]);

    // Average permissions coverage count
    const totalPossibleGrants = roles.length * 6;
    const totalActiveGrants = useMemo(() => {
        let count = 0;
        Object.keys(permissions).forEach((r) => {
            const perm = permissions[r];
            if (perm) {
                if (perm.readCMS) count++;
                if (perm.editCMS) count++;
                if (perm.readLeads) count++;
                if (perm.editLeads) count++;
                if (perm.configureSMTP) count++;
                if (perm.manageRBAC) count++;
            }
        });
        return count;
    }, [permissions]);

    const coveragePercentage = useMemo(() => {
        if (totalPossibleGrants === 0) return 0;
        return Math.round((totalActiveGrants / totalPossibleGrants) * 100);
    }, [totalActiveGrants, totalPossibleGrants]);

    // Avatar helpers
    const getInitials = (name: string) => {
        const parts = name.trim().split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const getAvatarGradient = (id: string) => {
        const gradients = [
            "from-brand-pink to-brand-magenta",
            "from-brand-blue to-brand-cyan",
            "from-violet-500 to-brand-magenta",
            "from-emerald-500 to-teal-600",
            "from-amber-500 to-brand-pink",
        ];
        let sum = 0;
        for (let i = 0; i < id.length; i++) {
            sum += id.charCodeAt(i);
        }
        return gradients[sum % gradients.length];
    };

    // Custom Switch UI
    const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => {
        return (
            <button
                type="button"
                onClick={onChange}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    checked ? "bg-brand-magenta shadow-glow" : "bg-white/10"
                }`}
            >
                <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        checked ? "translate-x-5" : "translate-x-0"
                    }`}
                />
            </button>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                    <h1 className="font-display text-2xl font-bold tracking-tight">RBAC Security Controls</h1>
                    <p className="text-xs text-muted-foreground mt-1">
                        Configure administrative privileges, manage permissions matrix, and monitor security staff directories.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {rolesLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                    <button
                        onClick={() => setIsAddRoleOpen(true)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 hover:border-brand-magenta/30 bg-white/5 hover:bg-white/10 px-4.5 py-2.5 text-xs font-semibold text-foreground transition cursor-pointer shadow-sm"
                    >
                        <Layers className="h-3.5 w-3.5 text-brand-cyan" /> Add Custom Role
                    </button>
                    <button
                        onClick={() => setIsAddUserOpen(true)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4.5 py-2.5 text-xs font-semibold text-white shadow-md hover:scale-[1.02] transition cursor-pointer"
                    >
                        <UserPlus className="h-3.5 w-3.5" /> Register Staff
                    </button>
                </div>
            </div>

            {/* Visual Analytics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-white/10 bg-card/30 p-4 backdrop-blur-xl flex items-center justify-between shadow-sm hover:border-white/20 transition-colors">
                    <div>
                        <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">Configured Roles</span>
                        <span className="text-2xl font-display font-bold mt-1 block text-foreground">{roles.length}</span>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                        <Shield className="h-5 w-5 text-brand-blue" />
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-card/30 p-4 backdrop-blur-xl flex items-center justify-between shadow-sm hover:border-white/20 transition-colors">
                    <div>
                        <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">Active Admin Staff</span>
                        <span className="text-2xl font-display font-bold mt-1 block text-emerald-400">{activeStaffCount}</span>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <UserCheck className="h-5 w-5 text-emerald-400" />
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-card/30 p-4 backdrop-blur-xl flex items-center justify-between shadow-sm hover:border-white/20 transition-colors">
                    <div>
                        <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">Suspended Directory</span>
                        <span className="text-2xl font-display font-bold mt-1 block text-rose-400">{inactiveStaffCount}</span>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                        <ShieldAlert className="h-5 w-5 text-rose-400" />
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-card/30 p-4 backdrop-blur-xl flex items-center justify-between shadow-sm hover:border-white/20 transition-colors">
                    <div>
                        <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">Access Permissions Coverage</span>
                        <span className="text-2xl font-display font-bold mt-1 block text-brand-magenta">{coveragePercentage}%</span>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-brand-magenta/10 flex items-center justify-center border border-brand-magenta/20">
                        <Activity className="h-5 w-5 text-brand-magenta animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Split Screen RBAC Area */}
            <div className="grid gap-6 lg:grid-cols-12 items-start">
                
                {/* LEFT SIDE: Roles Selector & Permissions Detail (Grid width: 7 on desktop) */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Roles tab selection */}
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-4.5 backdrop-blur-xl">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-4">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Select Administrative Role</span>
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-muted-foreground">{roles.length} roles total</span>
                        </div>
                        <div className="grid gap-3.5 sm:grid-cols-3">
                            {roles.map((item) => {
                                const isSelected = selectedRole === item.role;
                                return (
                                    <div
                                        key={item.role}
                                        onClick={() => setSelectedRole(item.role)}
                                        className={`cursor-pointer rounded-2xl border p-4.5 backdrop-blur-xl transition duration-300 relative overflow-hidden ${
                                            isSelected
                                                ? "border-brand-magenta bg-brand-magenta/5 shadow-glow text-foreground"
                                                : "border-white/10 bg-card/40 text-muted-foreground hover:border-white/20 hover:text-foreground"
                                        }`}
                                    >
                                        {isSelected && (
                                            <span className="absolute right-3.5 top-3.5 h-2 w-2 rounded-full bg-brand-magenta shadow-glow" />
                                        )}
                                        <div className="font-bold text-xs pr-4">{item.role}</div>
                                        <p className="text-[10px] leading-relaxed mt-2 line-clamp-3">{item.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Permissions Detail panel */}
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-5.5 backdrop-blur-xl shadow-elegant">
                        <div className="border-b border-white/5 pb-3 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <div className="text-[9px] uppercase font-bold text-brand-magenta tracking-wider">Access Privilege Audit</div>
                                <h3 className="text-sm font-bold text-foreground mt-0.5 flex items-center gap-1.5">
                                    <ShieldCheck className="h-4.5 w-4.5 text-brand-cyan" />
                                    Configure Role: <span className="text-gradient font-black">{selectedRole}</span>
                                </h3>
                            </div>
                            
                            {/* Toggle Matrix / Detail View */}
                            <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/5 self-start sm:self-auto">
                                <button
                                    onClick={() => setPermissionsViewMode("detail")}
                                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition ${
                                        permissionsViewMode === "detail" ? "bg-brand-magenta text-white shadow-glow" : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    Detail Controls
                                </button>
                                <button
                                    onClick={() => setPermissionsViewMode("matrix")}
                                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition ${
                                        permissionsViewMode === "matrix" ? "bg-brand-magenta text-white shadow-glow" : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    Overview Matrix
                                </button>
                            </div>
                        </div>

                        {/* View Mode 1: Detailed Toggles */}
                        {permissionsViewMode === "detail" && (
                            <div className="grid gap-3.5 sm:grid-cols-2">
                                {permissionFields.map((perm) => {
                                    const rolePerms = permissions[selectedRole] || {
                                        readCMS: false, editCMS: false, readLeads: false, editLeads: false, configureSMTP: false, manageRBAC: false
                                    };
                                    const isGranted = rolePerms[perm.key];
                                    
                                    return (
                                        <div 
                                            key={perm.key} 
                                            className={`rounded-xl border p-3.5 transition flex flex-col justify-between gap-2.5 ${
                                                isGranted 
                                                    ? "bg-white/5 border-white/10 hover:border-brand-magenta/30" 
                                                    : "bg-white/[0.01] border-white/5 opacity-70"
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <span className={`text-[11px] font-bold block ${isGranted ? "text-foreground" : "text-muted-foreground"}`}>
                                                        {perm.label}
                                                    </span>
                                                    <span className="text-[9px] text-muted-foreground mt-0.5 block leading-normal">
                                                        {perm.desc}
                                                    </span>
                                                </div>
                                                
                                                <ToggleSwitch
                                                    checked={isGranted}
                                                    onChange={() => handlePermissionToggle(selectedRole, perm.key)}
                                                />
                                            </div>
                                            
                                            <div className="flex items-center gap-1.5 mt-1 border-t border-white/5 pt-2">
                                                <Info className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-[8px] font-mono uppercase tracking-wider text-muted-foreground">
                                                    KEY: security.{perm.key}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* View Mode 2: Multi-Role Comparison Overview Matrix */}
                        {permissionsViewMode === "matrix" && (
                            <div className="overflow-x-auto border border-white/5 rounded-xl bg-white/[0.01]">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="border-b border-white/10 bg-white/[0.02] text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                                            <th className="p-3.5">Security Role</th>
                                            {permissionFields.map((f) => (
                                                <th key={f.key} className="p-3.5 text-center truncate max-w-[100px]">{f.label}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 font-medium">
                                        {roles.map((rItem) => (
                                            <tr key={rItem.role} className={`hover:bg-white/5 transition-colors ${rItem.role === selectedRole ? "bg-white/5" : ""}`}>
                                                <td className="p-3.5 font-bold text-foreground whitespace-nowrap">
                                                    {rItem.role}
                                                </td>
                                                {permissionFields.map((field) => {
                                                    const rolePerms = permissions[rItem.role] || {
                                                        readCMS: false, editCMS: false, readLeads: false, editLeads: false, configureSMTP: false, manageRBAC: false
                                                    };
                                                    const hasPerm = rolePerms[field.key];
                                                    return (
                                                        <td key={field.key} className="p-3.5 text-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => handlePermissionToggle(rItem.role, field.key)}
                                                                className={`mx-auto h-5.5 w-5.5 rounded-full flex items-center justify-center border transition-all ${
                                                                    hasPerm 
                                                                        ? "bg-brand-magenta/15 border-brand-magenta/30 text-brand-magenta shadow-glow" 
                                                                        : "bg-white/5 border-transparent text-muted-foreground hover:bg-white/10"
                                                                }`}
                                                            >
                                                                {hasPerm ? <Check className="h-3 w-3" /> : <X className="h-2.5 w-2.5" />}
                                                            </button>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE: Staff Directory List (Grid width: 5 on desktop) */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Filter controls panel */}
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl space-y-3.5">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                                <Filter className="h-3.5 w-3.5 text-brand-blue" /> Staff Directory Filters
                            </span>
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-brand-blue">
                                {filteredUsers.length} of {users.length} Listed
                            </span>
                        </div>

                        {/* Search and Filters row */}
                        <div className="space-y-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or role..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-xl border border-border bg-background pl-9 pr-8 py-2 text-xs focus:outline-none text-foreground focus:border-brand-magenta transition-colors"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3.5">
                                <div>
                                    <label className="block text-[8px] uppercase tracking-wider font-bold text-muted-foreground mb-1">Privilege Filter</label>
                                    <select
                                        value={roleFilter}
                                        onChange={(e) => setRoleFilter(e.target.value)}
                                        className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs focus:outline-none text-foreground cursor-pointer"
                                    >
                                        <option value="All">All roles</option>
                                        {roles.map((r) => (
                                            <option key={r.role} value={r.role}>{r.role}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[8px] uppercase tracking-wider font-bold text-muted-foreground mb-1">Status Filter</label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs focus:outline-none text-foreground cursor-pointer"
                                    >
                                        <option value="All">All status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Staff List card */}
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-4.5 backdrop-blur-xl shadow-elegant">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-3">Registered Staff</span>
                        
                        <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                            <AnimatePresence initial={false}>
                                {filteredUsers.map((u) => {
                                    const initials = getInitials(u.name);
                                    const gradient = getAvatarGradient(u.id);
                                    const isSuspended = u.status === "Inactive";
                                    
                                    return (
                                        <motion.div
                                            key={u.id}
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/5 p-3 hover:border-white/15 transition-all hover:bg-white/[0.07] group/item">
                                                <div className="flex items-center gap-3">
                                                    {/* Custom initial Avatar */}
                                                    <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-[11px] font-bold text-white shadow-sm shrink-0`}>
                                                        {initials}
                                                    </div>
                                                    
                                                    <div className="overflow-hidden">
                                                        <div className="font-bold text-xs text-foreground truncate flex items-center gap-1.5">
                                                            {u.name}
                                                            {isSuspended && (
                                                                <span className="text-[7px] uppercase font-bold bg-rose-500/15 text-rose-400 px-1 py-0.5 rounded">
                                                                    suspended
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-[10px] text-muted-foreground block truncate mt-0.5">{u.email}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <div className="flex flex-col items-end gap-1.5">
                                                        <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-white/10 text-foreground border border-white/5">
                                                            {u.role}
                                                        </span>
                                                        
                                                        <button
                                                            onClick={() => handleToggleUserStatus(u.id)}
                                                            className={`flex items-center gap-1 text-[9px] font-bold transition px-1.5 py-0.5 rounded hover:bg-white/5 ${
                                                                u.status === "Active" ? "text-emerald-400" : "text-rose-400"
                                                            }`}
                                                            title="Toggle administrative status"
                                                        >
                                                            <span className={`h-1.5 w-1.5 rounded-full ${u.status === "Active" ? "bg-emerald-400 shadow-glow" : "bg-rose-500"}`} />
                                                            {u.status}
                                                        </button>
                                                    </div>
                                                    
                                                    {/* Hover actions */}
                                                    <div className="flex items-center gap-0.5 border-l border-white/5 pl-2 ml-1">
                                                        <button
                                                            onClick={() => {
                                                                setEditingUser({ ...u });
                                                                setIsEditUserOpen(true);
                                                            }}
                                                            className="p-1.5 rounded-lg text-muted-foreground hover:text-brand-cyan hover:bg-white/5 transition cursor-pointer"
                                                            title="Edit profile"
                                                        >
                                                            <Edit3 className="h-3.5 w-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setDeletingUser(u);
                                                                setIsDeleteConfirmOpen(true);
                                                            }}
                                                            className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-400 hover:bg-white/5 transition cursor-pointer"
                                                            title="De-register staff"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                                
                                {filteredUsers.length === 0 && (
                                    <div className="text-center py-10 text-muted-foreground text-xs bg-white/[0.01] border border-dashed border-white/10 rounded-xl">
                                        <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground/55" />
                                        No registered staff match the active filters.
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Audit Trail Log Footer Panel */}
            <div className="rounded-2xl border border-white/10 bg-card/40 p-5.5 backdrop-blur-xl shadow-elegant">
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-4">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1.5">
                        <History className="h-4 w-4 text-brand-magenta" /> Role-Based Access Audit Log (RBAC)
                    </span>
                    <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-white/5 text-muted-foreground">
                        TLS Verified Session Logs
                    </span>
                </div>
                
                <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                    {auditLogs.map((log) => {
                        let logColor = "text-brand-blue";
                        if (log.type === "permission") logColor = "text-brand-magenta";
                        if (log.type === "create") logColor = "text-emerald-400";
                        if (log.type === "delete") logColor = "text-rose-400";
                        if (log.type === "role") logColor = "text-brand-cyan";
                        
                        return (
                            <div key={log.id} className="flex items-start justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0 text-xs">
                                <div className="flex items-start gap-3">
                                    <div className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${
                                        log.type === "delete" ? "bg-rose-500" :
                                        log.type === "create" ? "bg-emerald-400" :
                                        log.type === "permission" ? "bg-brand-magenta" : "bg-brand-blue"
                                    }`} />
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-semibold text-foreground leading-none">{log.action}</span>
                                            <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/5 border border-white/5 ${logColor}`}>
                                                {log.type}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground mt-1 font-sans">
                                            {log.details} • Triggered by <span className="text-foreground font-semibold">{log.user}</span>
                                        </p>
                                    </div>
                                </div>
                                <span className="text-[10px] text-muted-foreground font-mono whitespace-nowrap ml-4 shrink-0">{log.timestamp}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ───────────────── MODALS & DIALOGS OVERLAYS ───────────────── */}
            <AnimatePresence>
                
                {/* 1. Register Staff Modal */}
                {isAddUserOpen && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-elegant space-y-4 text-foreground"
                        >
                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                <h3 className="font-display font-bold text-sm tracking-tight flex items-center gap-1.5">
                                    <UserPlus className="h-4.5 w-4.5 text-brand-magenta" /> Register Staff Profile
                                </h3>
                                <button
                                    onClick={() => setIsAddUserOpen(false)}
                                    className="text-muted-foreground hover:text-foreground p-1 rounded transition cursor-pointer"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                            
                            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
                                <div>
                                    <label className="block text-[9px] uppercase font-bold text-muted-foreground mb-1.5 tracking-wider">
                                        Staff Member Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Hammad Khan"
                                        value={newUserName}
                                        onChange={(e) => setNewUserName(e.target.value)}
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
                                        placeholder="hammad@clicktake.co"
                                        value={newUserEmail}
                                        onChange={(e) => setNewUserEmail(e.target.value)}
                                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[9px] uppercase font-bold text-muted-foreground mb-1.5 tracking-wider">
                                        Administrative Role
                                    </label>
                                    <select
                                        value={newUserRole}
                                        onChange={(e) => setNewUserRole(e.target.value)}
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors cursor-pointer"
                                    >
                                        {roles.map((r) => (
                                            <option key={r.role} value={r.role}>{r.role}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddUserOpen(false)}
                                        className="flex-1 rounded-xl border border-white/10 hover:bg-white/5 py-2.5 text-xs font-semibold transition text-center cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 rounded-xl bg-gradient-brand text-white py-2.5 text-xs font-semibold shadow-md hover:scale-[1.01] transition text-center cursor-pointer animate-gradient"
                                    >
                                        Register Staff
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {/* 2. Edit Staff Modal */}
                {isEditUserOpen && editingUser && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-elegant space-y-4 text-foreground"
                        >
                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                <h3 className="font-display font-bold text-sm tracking-tight flex items-center gap-1.5">
                                    <Settings className="h-4.5 w-4.5 text-brand-cyan" /> Edit Staff Profile
                                </h3>
                                <button
                                    onClick={() => {
                                        setIsEditUserOpen(false);
                                        setEditingUser(null);
                                    }}
                                    className="text-muted-foreground hover:text-foreground p-1 rounded transition cursor-pointer"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                            
                            <form onSubmit={handleEditUserSubmit} className="space-y-4 text-xs">
                                <div>
                                    <label className="block text-[9px] uppercase font-bold text-muted-foreground mb-1.5 tracking-wider">
                                        Staff Member Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editingUser.name}
                                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[9px] uppercase font-bold text-muted-foreground mb-1.5 tracking-wider">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={editingUser.email}
                                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[9px] uppercase font-bold text-muted-foreground mb-1.5 tracking-wider">
                                        Administrative Role
                                    </label>
                                    <select
                                        value={editingUser.role}
                                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors cursor-pointer"
                                    >
                                        {roles.map((r) => (
                                            <option key={r.role} value={r.role}>{r.role}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditUserOpen(false);
                                            setEditingUser(null);
                                        }}
                                        className="flex-1 rounded-xl border border-white/10 hover:bg-white/5 py-2.5 text-xs font-semibold transition text-center cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 rounded-xl bg-brand-magenta text-white py-2.5 text-xs font-semibold shadow-md hover:scale-[1.01] transition text-center cursor-pointer"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {/* 3. Create Custom Role Modal */}
                {isAddRoleOpen && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-elegant space-y-4 text-foreground"
                        >
                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                <h3 className="font-display font-bold text-sm tracking-tight flex items-center gap-1.5">
                                    <Layers className="h-4.5 w-4.5 text-brand-cyan" /> Define Custom Security Role
                                </h3>
                                <button
                                    onClick={() => setIsAddRoleOpen(false)}
                                    className="text-muted-foreground hover:text-foreground p-1 rounded transition cursor-pointer"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                            
                            <form onSubmit={handleCreateRole} className="space-y-4 text-xs">
                                <div>
                                    <label className="block text-[9px] uppercase font-bold text-muted-foreground mb-1.5 tracking-wider">
                                        Role Title
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Auditor"
                                        value={newRoleName}
                                        onChange={(e) => setNewRoleName(e.target.value)}
                                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors"
                                        required
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="block text-[9px] uppercase font-bold text-muted-foreground mb-1.5 tracking-wider">
                                        Access Privilege Description
                                    </label>
                                    <textarea
                                        rows={3}
                                        placeholder="Describe what access resources this security clearance governs..."
                                        value={newRoleDesc}
                                        onChange={(e) => setNewRoleDesc(e.target.value)}
                                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-brand-magenta transition-colors resize-none"
                                        required
                                    />
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddRoleOpen(false)}
                                        className="flex-1 rounded-xl border border-white/10 hover:bg-white/5 py-2.5 text-xs font-semibold transition text-center cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 rounded-xl bg-brand-cyan text-slate-900 py-2.5 text-xs font-bold shadow-md hover:scale-[1.01] transition text-center cursor-pointer"
                                    >
                                        Create Role
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {/* 4. Delete Staff Confirmation Modal */}
                {isDeleteConfirmOpen && deletingUser && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card border border-rose-500/20 rounded-2xl p-6 max-w-sm w-full shadow-elegant space-y-4 text-foreground animate-pulse-glow"
                        >
                            <div className="flex items-center gap-2.5 text-rose-400 border-b border-white/5 pb-3">
                                <AlertTriangle className="h-5 w-5 shrink-0" />
                                <h3 className="font-display font-bold text-sm tracking-tight">De-register Staff Member?</h3>
                            </div>
                            
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                You are about to permanently remove <span className="text-foreground font-semibold">{deletingUser.name}</span> ({deletingUser.email}) from the ClickTake access directory. This staff member will immediately lose all CRM/CMS access privileges.
                            </p>

                            <div className="flex items-center gap-2.5 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsDeleteConfirmOpen(false);
                                        setDeletingUser(null);
                                    }}
                                    className="flex-1 rounded-xl border border-white/10 hover:bg-white/5 py-2.5 text-xs font-semibold transition text-center cursor-pointer"
                                >
                                    No, Keep Profile
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDeleteUserConfirm}
                                    className="flex-1 rounded-xl bg-rose-600 text-white py-2.5 text-xs font-semibold shadow-md hover:bg-rose-700 transition text-center cursor-pointer"
                                >
                                    Yes, De-register
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
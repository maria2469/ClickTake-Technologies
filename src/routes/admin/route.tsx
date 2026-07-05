import { createFileRoute, Link, Outlet, useLocation, useRouter } from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  LayoutDashboard,
  FileText,
  Users,
  Mail,
  ShieldAlert,
  Search,
  Settings,
  Shield,
  Menu,
  Bell,
  Globe,
  Sparkles,
  X,
  LogOut,
  Loader2,
} from "lucide-react";
import { BackgroundScene } from "@/components/BackgroundScene";
import { CustomCursor } from "@/components/CustomCursor";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard Overview", icon: LayoutDashboard, permission: "manageRBAC" },
  { to: "/admin/cms", label: "CMS Management", icon: FileText, permission: "readCMS" },
  { to: "/admin/crm", label: "Lead CRM", icon: Users, permission: "readLeads" },
  { to: "/admin/roles", label: "User Roles (RBAC)", icon: Shield, permission: "manageRBAC" },
  { to: "/admin/email", label: "Email Center", icon: Mail, permission: "readLeads" },
  { to: "/admin/seo", label: "SEO & Analytics", icon: Globe, permission: "readCMS" },
  { to: "/admin/settings", label: "Config Settings", icon: Settings, permission: "manageRBAC" },
  { to: "/admin/security", label: "Security & Logs", icon: ShieldAlert, permission: "manageRBAC" },
] as const;

const ROUTE_PERMISSIONS: Record<string, string> = {
  "/admin": "manageRBAC",
  "/admin/": "manageRBAC",
  "/admin/cms": "readCMS",
  "/admin/crm": "readLeads",
  "/admin/roles": "manageRBAC",
  "/admin/email": "readLeads",
  "/admin/seo": "readCMS",
  "/admin/settings": "manageRBAC",
  "/admin/security": "manageRBAC",
};

export const getAllowedHomePath = (perms: Set<string>) => {
  if (perms.has('manageRBAC')) return '/admin';
  if (perms.has('readCMS')) return '/admin/cms';
  if (perms.has('readLeads')) return '/admin/crm';
  return null;
};

export function RequirePermission({ permission, children, fallback = null }: { permission: string; children: ReactNode; fallback?: ReactNode }) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  useEffect(() => {
    supabase.from('role_permissions').select('is_granted')
      .eq('permission_key', permission).then(({ data }) => {
        setHasPermission(data?.[0]?.is_granted ?? false);
      });
  }, [permission]);
  if (hasPermission === null) return null;
  return hasPermission ? <>{children}</> : <>{fallback}</>;
}

function AdminLayout() {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [adminProfile, setAdminProfile] = useState<any>(null);
  const location = useLocation();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [themeAccent, setThemeAccent] = useState("magenta");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Set<string>>(new Set());

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        if (location.pathname !== '/admin/login' && location.pathname !== '/admin/forgot-password' && location.pathname !== '/admin/create-admin') {
          router.navigate({ to: '/admin/login' });
          return;
        }
      } else {
        setUser(session.user);
        // Fetch admin profile from admin_users table
        const { data: profile } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', session.user.email)
          .single();
        if (profile) {
          // Fetch role name separately (FK may not be recognized by REST API)
          const { data: roleData } = await supabase
            .from('admin_roles')
            .select('role_name')
            .eq('id', profile.role_id)
            .single();
          setAdminProfile({ ...profile, admin_roles: roleData || { role_name: 'Administrator' } });
          // Fetch permissions for the user's role
          const { data: perms } = await supabase
            .from('role_permissions')
            .select('permission_key, is_granted')
            .eq('role_id', profile.role_id);
          const loadedPerms = new Set<string>();
          if (perms) {
            perms.filter(p => p.is_granted).forEach(p => loadedPerms.add(p.permission_key));
            setPermissions(loadedPerms);
          }

          // Redirect to appropriate section if trying to access root admin overview without permission
          const path = location.pathname.replace(/\/$/, "");
          if (path === '/admin') {
            if (!loadedPerms.has('manageRBAC')) {
              if (loadedPerms.has('readCMS')) {
                router.navigate({ to: '/admin/cms' });
              } else if (loadedPerms.has('readLeads')) {
                router.navigate({ to: '/admin/crm' });
              }
            }
          }
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [location.pathname]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('admin_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      if (data) setNotifications(data);
    };

    const fetchSettings = async () => {
      const { data } = await supabase.from('site_settings').select('key, value').in('key', ['theme_accent', 'logo_url']);
      if (data) {
        const theme = data.find(s => s.key === 'theme_accent')?.value;
        const logo = data.find(s => s.key === 'logo_url')?.value;
        if (theme) setThemeAccent(theme);
        if (logo) setLogoUrl(logo);
      }
    };

    fetchNotifications();
    fetchSettings();

    const notifChannel = supabase.channel('notifications-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_notifications' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setNotifications(prev => [payload.new, ...prev].slice(0, 10));
        } else if (payload.eventType === 'UPDATE') {
          setNotifications(prev => prev.map(n => n.id === payload.new.id ? payload.new : n));
        } else if (payload.eventType === 'DELETE') {
          setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(notifChannel); };
  }, []);

  // Skip admin shell for login/forgot-password/create-admin pages
  if (location.pathname === '/admin/login' || location.pathname === '/admin/forgot-password' || location.pathname === '/admin/create-admin') {
    return <Outlet />;
  }

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-background text-foreground flex items-center justify-center">
        <BackgroundScene />
        <Loader2 className="h-8 w-8 animate-spin text-brand-magenta" />
      </div>
    );
  }

  if (!user) return null;

  // Route-level RBAC check (skip if no admin profile yet)
  const cleanPath = location.pathname.replace(/\/$/, "");
  const requiredPermission = adminProfile && ROUTE_PERMISSIONS[cleanPath || "/admin"];
  if (requiredPermission && !permissions.has(requiredPermission)) {
    const allowedHome = getAllowedHomePath(permissions);
    return (
      <div className="relative min-h-screen bg-background text-foreground flex items-center justify-center">
        <BackgroundScene />
        <div className="text-center space-y-3">
          <ShieldAlert className="h-12 w-12 text-red-400 mx-auto" />
          <p className="text-sm text-muted-foreground">You do not have permission to access this page.</p>
          {allowedHome ? (
            <Link to={allowedHome} className="text-xs text-brand-magenta hover:underline">Go to your section</Link>
          ) : (
            <button 
              onClick={async () => {
                await supabase.auth.signOut();
                router.navigate({ to: '/admin/login' });
              }} 
              className="text-xs text-brand-magenta hover:underline cursor-pointer"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    );
  }

  const userInitials = adminProfile?.full_name
    ? adminProfile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email?.slice(0, 2).toUpperCase() || 'AD';
  const userName = adminProfile?.full_name || user.email?.split('@')[0] || 'Administrator';
  const userRole = adminProfile?.role || adminProfile?.admin_roles?.role_name || 'Administrator';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.navigate({ to: '/admin/login' });
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
    if (unreadIds.length === 0) return;
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    await supabase.from('admin_notifications').update({ is_read: true }).in('id', unreadIds);
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const activeColorTheme =
      themeAccent === "magenta"
          ? "from-brand-magenta to-brand-blue"
          : themeAccent === "pink"
              ? "from-brand-pink to-brand-magenta"
              : themeAccent === "cyan"
                  ? "from-brand-cyan to-brand-blue"
                  : "from-brand-pink to-brand-cyan";

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden transition-colors duration-300">
      <BackgroundScene />
      <CustomCursor />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/50 backdrop-blur-xl transition-all duration-300">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="rounded-lg p-2 hover:bg-secondary transition-colors"
              aria-label="Toggle Sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link to="/" className="flex items-center gap-3">
              <div className="h-9 w-9 overflow-hidden rounded-lg ring-1 ring-border shadow-sm flex items-center justify-center bg-card">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-gradient-brand flex items-center justify-center text-white font-display text-xs font-black">
                    CT
                  </div>
                )}
              </div>
              <div>
                <div className="font-display text-sm font-extrabold tracking-tight">ClickTake</div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Admin Panel</div>
              </div>
            </Link>
          </div>

          {/* Quick Actions Search Bar */}
          <div className="hidden md:flex relative max-w-md w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search leads, settings, page..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-border bg-card/60 pl-10 pr-4 py-1.5 text-xs focus:border-brand-magenta focus:outline-none backdrop-blur-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Notifications */}
            <div className="relative group">
              <button className="relative rounded-full p-2 border border-border bg-card/80 hover:bg-secondary transition-colors">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 animate-pulse" />}
              </button>

              <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-card p-3 shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200">
                <div className="text-xs font-bold border-b border-border pb-2 mb-2 flex justify-between items-center">
                   <span>Recent Notifications</span>
                   {unreadCount > 0 && (
                     <button onClick={markAllAsRead} className="text-[9px] font-normal text-brand-magenta hover:underline cursor-pointer">
                       Mark all read
                     </button>
                   )}
                </div>
                <div className="space-y-2.5 max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="text-[10px] text-muted-foreground text-center py-4">No new notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className={`text-[11px] leading-normal ${!n.is_read ? 'bg-white/5 p-2 rounded-md border border-white/10' : 'border-t border-border/40 pt-2'}`}>
                        <span className={`font-semibold ${n.type === 'lead' ? 'text-brand-magenta' : n.type === 'security' ? 'text-rose-500' : 'text-brand-blue'}`}>
                          {n.title}:
                        </span> {n.message}
                        <div className="text-[9px] text-muted-foreground mt-1">{new Date(n.created_at).toLocaleString()}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Profile + Logout */}
            <div className="flex items-center gap-2 border-l border-border pl-3">
              <div className={`h-8 w-8 rounded-full bg-linear-to-tr ${activeColorTheme} flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                {userInitials}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold leading-tight">{userName}</div>
                <div className="text-[9px] text-muted-foreground font-medium">{userRole}</div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 rounded-lg p-1.5 text-muted-foreground hover:text-rose-400 hover:bg-white/5 transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Workspace */}
      <div className="flex min-h-[calc(100vh-64px)] relative">
        {/* Left Sidebar Navigation */}
        <aside
          className={`shrink-0 border-r border-border/80 bg-card/40 backdrop-blur-xl transition-all duration-300 ${isSidebarCollapsed ? "w-16" : "w-64"
            }`}
        >
          <div className="flex flex-col gap-1 p-3">
            {NAV_ITEMS.filter(item => !item.permission || !adminProfile || permissions.has(item.permission)).map((item) => {
              const ItemIcon = item.icon;
              const isActive =
                item.to === "/admin"
                  ? location.pathname === "/admin" || location.pathname === "/admin/"
                  : location.pathname.startsWith(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`group flex items-center gap-3 rounded-xl px-4 py-3.5 text-left text-xs font-bold transition-all ${isActive
                      ? `bg-linear-to-r ${activeColorTheme} text-white shadow-glow`
                      : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <ItemIcon className={`h-4.5 w-4.5 ${isActive ? "text-white" : "group-hover:scale-105 transition-transform"}`} />
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>

          {!isSidebarCollapsed && (
            <div className="absolute bottom-6 left-6 right-6 border border-white/5 bg-card/60 p-4 rounded-2xl hidden lg:block backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-magenta" />
                <div className="text-[10px] font-bold uppercase tracking-wider text-foreground">ClickTake CRM</div>
              </div>
              <div className="text-[10px] text-muted-foreground mt-1 leading-normal">
                v2.6 Enterprise System. Running smoothly on server clusters.
              </div>
            </div>
          )}
        </aside>

        {/* Routed Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
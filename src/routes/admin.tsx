import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useState } from "react";
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
} from "lucide-react";
import { BackgroundScene } from "@/components/BackgroundScene";
import { CustomCursor } from "@/components/CustomCursor";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard Overview", icon: LayoutDashboard },
  { to: "/admin/cms", label: "CMS Management", icon: FileText },
  { to: "/admin/crm", label: "Lead CRM", icon: Users },
  { to: "/admin/roles", label: "User Roles (RBAC)", icon: Shield },
  { to: "/admin/email", label: "Email Center", icon: Mail },
  { to: "/admin/seo", label: "SEO & Analytics", icon: Globe },
  { to: "/admin/settings", label: "Config Settings", icon: Settings },
  { to: "/admin/security", label: "Security & Logs", icon: ShieldAlert },
] as const;

function AdminLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

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
              <div className="h-9 w-9 overflow-hidden rounded-lg ring-1 ring-border shadow-sm">
                <div className="h-full w-full bg-gradient-brand flex items-center justify-center text-white font-display text-xs font-black">
                  CT
                </div>
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
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              </button>

              <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-card p-3 shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200">
                <div className="text-xs font-bold border-b border-border pb-2 mb-2">Recent Notifications</div>
                <div className="space-y-2.5 max-h-60 overflow-y-auto">
                  <div className="text-[11px] leading-normal">
                    <span className="font-semibold text-brand-magenta">New Lead Submission:</span> Sarah Connor interest in AI Chatbots.
                    <div className="text-[9px] text-muted-foreground">10 mins ago</div>
                  </div>
                  <div className="text-[11px] leading-normal border-t border-border/40 pt-2">
                    <span className="font-semibold text-brand-blue">Security Alert:</span> 2 unsuccessful root logins from IP 185.220.101.4.
                    <div className="text-[9px] text-muted-foreground">2 hours ago</div>
                  </div>
                  <div className="text-[11px] leading-normal border-t border-border/40 pt-2">
                    <span className="font-semibold text-emerald-400">SMTP Server Status:</span> Connection resolved with healthy latency.
                    <div className="text-[9px] text-muted-foreground">Yesterday</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-2 border-l border-border pl-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand-pink to-brand-magenta flex items-center justify-center text-white text-xs font-bold shadow-md">
                ZP
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold leading-tight">Zain Paracha</div>
                <div className="text-[9px] text-muted-foreground font-medium">Super Administrator</div>
              </div>
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
            {NAV_ITEMS.map((item) => {
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
                      ? "bg-gradient-to-r from-brand-magenta to-brand-blue text-white shadow-glow"
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
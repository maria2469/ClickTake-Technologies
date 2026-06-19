import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Users,
  Mail,
  Plus,
  ChevronRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Portal — ClickTake Technologies" },
      { name: "description", content: "Enterprise administrator dashboard for ClickTake Technologies" },
    ],
  }),
  component: AdminDashboard,
});

/* ───────────────── CHART MOCK DATA ───────────────── */
const leadsGrowthData = [
  { month: "Jan", leads: 120, queries: 32 },
  { month: "Feb", leads: 150, queries: 40 },
  { month: "Mar", leads: 220, queries: 45 },
  { month: "Apr", leads: 180, queries: 38 },
  { month: "May", leads: 290, queries: 60 },
  { month: "Jun", leads: 320, queries: 42 },
];

const trafficSourcesData = [
  { name: "Organic Search", value: 45, color: "oklch(0.75 0.15 220)" },
  { name: "Direct Traffic", value: 20, color: "oklch(0.55 0.28 330)" },
  { name: "Paid Ads", value: 25, color: "oklch(0.7 0.22 0)" },
  { name: "Social Media", value: 10, color: "oklch(0.55 0.22 270)" },
];

const auditLogs = [
  { id: 1, user: "Zain Paracha", action: "Updated SMTP relay host", time: "10 mins ago" },
  { id: 2, user: "Maria Qasim", action: "Created blog post draft", time: "1 hour ago" },
  { id: 3, user: "System Monitor", action: "Blocked IP 185.220.101.4 (Rate Limit)", time: "2 hours ago" },
  { id: 4, user: "Hamza Farooq", action: "Changed Lead L3 status to 'In Progress'", time: "4 hours ago" },
];

function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-xs text-muted-foreground mt-1">
          System snapshot for ClickTake Technologies operations.
        </p>
      </div>

      {/* KPI metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Total Leads", val: 1482, trend: "+15.2%", status: "up" },
          { label: "Monthly Leads", val: 320, trend: "+8.4%", status: "up" },
          { label: "Active Queries", val: 42, trend: "-3.1%", status: "down" },
          { label: "Conversion Rate", val: "4.8%", trend: "+0.6%", status: "up" },
          { label: "Page Views", val: "48,291", trend: "+22.1%", status: "up" },
        ].map((card, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl hover:border-white/20 transition-all duration-300"
          >
            <div className="text-xs text-muted-foreground font-semibold">{card.label}</div>
            <div className="mt-2 text-2xl font-display font-bold">{card.val}</div>
            <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold">
              {card.status === "up" ? (
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-rose-400" />
              )}
              <span className={card.status === "up" ? "text-emerald-400" : "text-rose-400"}>
                {card.trend}
              </span>
              <span className="text-muted-foreground font-normal">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Line Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Leads Growth Timeline</h3>
              <div className="text-[10px] text-muted-foreground">Monthly volume of inbound leads and service requests</div>
            </div>
            <div className="rounded-full bg-white/5 border border-white/5 px-2.5 py-1 text-[9px] font-bold">
              Last 6 Months
            </div>
          </div>

          <div className="h-64 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={leadsGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" opacity={0.3} />
                  <XAxis dataKey="month" stroke="#71717a" fontSize={10} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                  <ChartTooltip
                    contentStyle={{ background: "rgba(20,20,20,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "11px" }}
                  />
                  <Line type="monotone" dataKey="leads" stroke="oklch(0.55 0.28 330)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="queries" stroke="oklch(0.75 0.15 220)" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-secondary/20 animate-pulse rounded-lg" />
            )}
          </div>
        </div>

        {/* Traffic Sources Pie Chart */}
        <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Traffic Channels</h3>
            <div className="text-[10px] text-muted-foreground">Lead acquisition sources distribution</div>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center my-3">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={trafficSourcesData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                    {trafficSourcesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    contentStyle={{ background: "rgba(20,20,20,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "11px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-28 w-28 rounded-full border-8 border-t-brand-magenta animate-spin" />
            )}
            <div className="absolute text-center">
              <div className="text-lg font-bold">4.8k</div>
              <div className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Queries</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            {trafficSourcesData.map((ch, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: ch.color }} />
                <span className="text-muted-foreground">{ch.name}</span>
                <span className="font-semibold ml-auto">{ch.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Quick actions + Recent Activity Feed */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions Panel */}
        <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Quick Operations</h3>
            <div className="space-y-2.5">
              <Link
                to="/admin/cms"
                className="w-full flex items-center justify-between rounded-xl bg-white/5 border border-white/5 p-3 hover:bg-white/10 transition-all text-xs font-bold"
              >
                <span className="flex items-center gap-2">
                  <Plus className="h-4 w-4 text-brand-magenta" />
                  Add New Page Section
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </Link>

              <Link
                to="/admin/cms"
                className="w-full flex items-center justify-between rounded-xl bg-white/5 border border-white/5 p-3 hover:bg-white/10 transition-all text-xs font-bold"
              >
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-brand-cyan" />
                  Review CRM Submissions
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </Link>

              <Link
                to="/admin/email"
                className="w-full flex items-center justify-between rounded-xl bg-white/5 border border-white/5 p-3 hover:bg-white/10 transition-all text-xs font-bold"
              >
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-brand-pink" />
                  Send Bulk Email Blast
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </Link>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 mt-4 text-[10px] text-muted-foreground text-center">
            ClickTake System Engine • All integrations active
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Recent Server & User Logs</h3>
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
        </div>
      </div>
    </motion.div>
  );
}
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
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






import { toast } from "sonner";

function AdminDashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [totalPageViews, setTotalPageViews] = useState<number | string>("...");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: leadsData, error: leadsError } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
        if (leadsError) throw leadsError;
        setLeads(leadsData ?? []);

        const { count, error: viewsError } = await supabase.from('page_views').select('*', { count: 'exact', head: true });
        if (viewsError && viewsError.code !== '42P01') {
          toast.error(`Failed to fetch page views: ${viewsError.message}`);
        } else if (count !== null) {
          setTotalPageViews(count);
        }

        const { data: logsData, error: logsError } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(6);
        if (logsError && logsError.code !== '42P01') throw logsError;
        if (logsData) setAuditLogs(logsData.map((d: any) => ({ id: d.id, user: d.user_email, action: d.action, time: new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })));
      } catch (err: any) {
        toast.error(`Dashboard fetch error: ${err.message}`);
      }
    };
    fetchData();
  }, []);

  const { total, monthly, active, conversionRate, chartData, pieData } = useMemo(() => {
    const total = leads.length;
    const currentMonth = new Date().getMonth();
    const monthly = leads.filter(l => {
      const d = new Date(l.created_at);
      return !isNaN(d.getTime()) ? d.getMonth() === currentMonth : new Date().getMonth() === currentMonth;
    }).length;
    const active = leads.filter(l => ['new', 'contacted', 'in progress'].includes((l.status || '').toLowerCase())).length;
    const converted = leads.filter(l => (l.status || '').toLowerCase() === 'converted').length;
    const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) + '%' : '0%';
    
    const monthlyGroups: Record<string, { leads: number, queries: number }> = {};
    leads.forEach(l => {
      let d = new Date(l.created_at);
      if (isNaN(d.getTime())) d = new Date();
      const monthName = d.toLocaleString('default', { month: 'short' });
      if (!monthlyGroups[monthName]) monthlyGroups[monthName] = { leads: 0, queries: 0 };
      monthlyGroups[monthName].leads += 1;
      monthlyGroups[monthName].queries += (l.message ? 1 : 0);
    });
    
    const chartData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthName = d.toLocaleString('default', { month: 'short' });
      chartData.push({ month: monthName, leads: monthlyGroups[monthName]?.leads || 0, queries: monthlyGroups[monthName]?.queries || 0 });
    }

    const sourceGroups: Record<string, number> = {};
    leads.forEach(l => {
      let source = l.source_page || l.service_interest || 'Direct';
      if (source === '/') source = 'Home Page';
      sourceGroups[source] = (sourceGroups[source] || 0) + 1;
    });
    const colors = ["#0ea5e9", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#ef4444"];
    const pieData = Object.keys(sourceGroups).map((key, index) => ({ name: key, value: Math.round((sourceGroups[key] / total) * 100) || 0, color: colors[index % colors.length] }));
    if (pieData.length === 0) pieData.push({ name: "No Data", value: 100, color: "#333333" });

    return { total, monthly, active, conversionRate, chartData, pieData };
  }, [leads]);
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
          { label: "Total Leads", val: total, trend: "+15.2%", status: "up" },
          { label: "Monthly Leads", val: monthly, trend: "+8.4%", status: "up" },
          { label: "Active Queries", val: active, trend: "-3.1%", status: "down" },
          { label: "Conversion Rate", val: conversionRate, trend: "+0.6%", status: "up" },
          { label: "Page Views", val: totalPageViews, trend: "+22.1%", status: "up" },
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
                <TrendingDown className="h-3.5 w-3.5 text-brand-pink" />
              )}
              <span className={card.status === "up" ? "text-emerald-400" : "text-brand-pink"}>
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
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" opacity={0.3} />
                  <XAxis dataKey="month" stroke="#71717a" fontSize={10} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                  <ChartTooltip
                    contentStyle={{ background: "rgba(20,20,20,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "11px" }}
                  />
                  <Line type="monotone" dataKey="leads" stroke="var(--brand-magenta)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="queries" stroke="var(--brand-cyan)" strokeWidth={2} strokeDasharray="4 4" dot={false} />
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
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                    {pieData.map((entry, index) => (
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
            {pieData.map((ch, idx) => (
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
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Recent Leads</h3>
            <div className="space-y-3">
              {leads.slice(0, 5).map((lead) => (
                <div key={lead.id} className="flex items-start justify-between border-b border-white/5 pb-2.5 last:border-b-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-brand-cyan mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold leading-normal">{lead.name || 'Unnamed'}</p>
                      <p className="text-[10px] text-muted-foreground">Interest: <span className="text-foreground">{lead.service_interest || lead.interest || 'Unknown'}</span></p>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Recent Server Logs</h3>
            <div className="space-y-3">
              {auditLogs.slice(0, 5).map((log) => (
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
      </div>
    </motion.div>
  );
}
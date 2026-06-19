const fs = require('fs');

// Patch admin.crm.tsx
let crm = fs.readFileSync('src/routes/admin.crm.tsx', 'utf-8');

crm = crm.replace(/import { useState, useMemo } from "react";/, `import { useState, useMemo, useEffect } from "react";\nimport { supabase } from "@/lib/supabaseClient";`);

crm = crm.replace(/const initialLeads: Lead\[\] = \[[\s\S]*?\];/, `const initialLeads: any[] = [];`);

crm = crm.replace(/const \[leads, setLeads\] = useState<Lead\[\]>\(initialLeads\);/, 
`const [leads, setLeads] = useState<any[]>(initialLeads);

    useEffect(() => {
        const fetchLeads = async () => {
            const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
            setLeads(data ?? []);
            if (data && data.length > 0) setSelectedLeadId(data[0].id);
        };
        fetchLeads();

        const leadsChannel = supabase.channel('custom-insert-channel')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, async (payload) => {
                setLeads((currentLeads) => [payload.new, ...currentLeads]);
                await supabase.from('audit_logs').insert({ user_email: "System", action: \`New Lead: \${payload.new.name}\` });
                toast.success(\`New Lead Inquiry from \${payload.new.name}!\`);
            }).subscribe();

        return () => { supabase.removeChannel(leadsChannel); };
    }, []);`);

crm = crm.replace(/const handleStatusChange = \(leadId: string, status: Lead\["status"\]\) => \{[\s\S]*?\};/, 
`const handleStatusChange = async (leadId: string, status: string) => {
        const previousLeads = [...leads];
        setLeads(leads.map((l) => (l.id === leadId ? { ...l, status } : l)));
        const leadName = leads.find((l) => l.id === leadId)?.name || "Lead";
        const { error } = await supabase.from('leads').update({ status }).eq('id', leadId);
        if (error) { setLeads(previousLeads); toast.error("Failed to update status"); return; }
        await supabase.from('audit_logs').insert({ user_email: "Admin", action: \`Changed \${leadName} status to '\${status}'\` });
        toast.success(\`Updated \${leadName}'s status to \${status}\`);
    };`);

crm = crm.replace(/const handleAddNote = \(\) => \{[\s\S]*?\};/, 
`const handleAddNote = async () => {
        if (!newNoteText.trim() || !selectedLeadId) return;
        const existingNotes = Array.isArray(selectedLead?.internal_notes) ? selectedLead.internal_notes : [];
        const newNotes = [...existingNotes, newNoteText.trim()];
        const previousLeads = [...leads];
        setLeads(leads.map((l) => l.id === selectedLeadId ? { ...l, internal_notes: newNotes } : l));
        const { error } = await supabase.from('leads').update({ internal_notes: newNotes }).eq('id', selectedLeadId);
        if (error) { setLeads(previousLeads); toast.error("Failed to save note"); return; }
        setNewNoteText("");
        toast.success("Comment appended to audit trail");
    };`);

crm = crm.replace(/const handleDeleteNote = \(noteIndex: number\) => \{[\s\S]*?\};/, `// handleDeleteNote not supported in Supabase schema currently`);
crm = crm.replace(/const handleDeleteLead = \(leadId: string\) => \{[\s\S]*?\};/, `// handleDeleteLead removed for safety`);
crm = crm.replace(/const handleAddLeadSubmit = \(e: React\.FormEvent\) => \{[\s\S]*?\};/, `const handleAddLeadSubmit = (e: React.FormEvent) => { e.preventDefault(); toast.error("Disabled in live CRM"); }`);

// Fix lead mapped properties in UI
crm = crm.replace(/lead\.date/g, `(lead.date || (!isNaN(new Date(lead.created_at).getTime()) ? new Date(lead.created_at).toLocaleDateString() : new Date().toLocaleDateString()))`);
crm = crm.replace(/selectedLead\.notes\.map/g, `(Array.isArray(selectedLead.internal_notes) ? selectedLead.internal_notes : []).map`);
crm = crm.replace(/selectedLead\.notes\.length === 0/g, `(!selectedLead.internal_notes || selectedLead.internal_notes.length === 0)`);
crm = crm.replace(/lead\.interest/g, `(lead.interest || lead.service_interest || "N/A")`);
crm = crm.replace(/lead\.source/g, `(lead.source || lead.source_page || "Direct")`);
crm = crm.replace(/selectedLead\.interest/g, `(selectedLead.interest || selectedLead.service_interest || "N/A")`);
crm = crm.replace(/selectedLead\.source/g, `(selectedLead.source || selectedLead.source_page || "Direct")`);

fs.writeFileSync('src/routes/admin.crm.tsx', crm);

// Patch admin.index.tsx (Overview)
let overview = fs.readFileSync('src/routes/admin.index.tsx', 'utf-8');

overview = overview.replace(/import { useState, useEffect } from "react";/, `import { useState, useEffect, useMemo } from "react";\nimport { supabase } from "@/lib/supabaseClient";`);

overview = overview.replace(/const leadsGrowthData = \[[\s\S]*?\];/, ``);
overview = overview.replace(/const trafficSourcesData = \[[\s\S]*?\];/, ``);
overview = overview.replace(/const auditLogs = \[[\s\S]*?\];/, ``);

overview = overview.replace(/function AdminDashboard\(\) \{/, 
`function AdminDashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [totalPageViews, setTotalPageViews] = useState<number | string>("...");

  useEffect(() => {
    supabase.from('leads').select('*').order('created_at', { ascending: false }).then(({ data }) => setLeads(data ?? []));
    supabase.from('page_views').select('*', { count: 'exact', head: true }).then(({ count }) => { if (count !== null) setTotalPageViews(count); });
    supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(6).then(({ data }) => {
      if (data) setAuditLogs(data.map((d: any) => ({ id: d.id, user: d.user_email, action: d.action, time: new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })));
    });
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
  }, [leads]);`);

overview = overview.replace(/val: 1482/, `val: total`);
overview = overview.replace(/val: 320/, `val: monthly`);
overview = overview.replace(/val: 42/, `val: active`);
overview = overview.replace(/val: "4\.8%"/, `val: conversionRate`);
overview = overview.replace(/val: "48,291"/, `val: totalPageViews`);
overview = overview.replace(/data={leadsGrowthData}/, `data={chartData}`);
overview = overview.replace(/data={trafficSourcesData}/, `data={pieData}`);
overview = overview.replace(/trafficSourcesData\.map/g, `pieData.map`);

fs.writeFileSync('src/routes/admin.index.tsx', overview);

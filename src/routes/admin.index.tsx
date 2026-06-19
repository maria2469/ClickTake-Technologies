import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Users,
  Mail,
  ShieldAlert,
  Search,
  Settings,
  Shield,
  FileSpreadsheet,
  Plus,
  Trash2,
  Edit,
  Save,
  Send,
  Eye,
  CheckCircle,
  AlertTriangle,
  FolderOpen,
  Image as ImageIcon,
  Key,
  Menu,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Sparkles,
  Server,
  Lock,
  RefreshCw,
  Bell,
  User,
  Sliders,
  Check,
  X,
  Upload,
  Globe,
  Monitor,
  Copy,
  ToggleLeft,
  ToggleRight,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { BackgroundScene } from "@/components/BackgroundScene";
import { CustomCursor } from "@/components/CustomCursor";
import { ThemeToggle } from "@/components/ThemeToggle";
import { supabase } from "@/lib/supabaseClient";

// Recharts imports wrap for SSR safety
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

/* ───────────────── MOCK DATABASES ───────────────── */

// CRM Leads Database (Moved to Supabase)

// 2. CMS Pages Database
interface PageBlock {
  id: string;
  type: "header" | "text" | "media" | "button";
  content: string;
  meta?: string;
}

interface CMSPage {
  id: string;
  name: string;
  path: string;
  blocks: PageBlock[];
}

const initialPages: CMSPage[] = [
  {
    id: "home",
    name: "Home Page",
    path: "/",
    blocks: [
      { id: "h1", type: "header", content: "Connecting in a better way." },
      { id: "t1", type: "text", content: "We are a multi-national digital agency bridging premium design, enterprise development, advanced SEO, and autonomous AI systems to deliver compounding growth." },
      { id: "b1", type: "button", content: "Book a Call", meta: "#contact" }
    ]
  },
  {
    id: "about",
    name: "About Us",
    path: "/about",
    blocks: [
      { id: "h2", type: "header", content: "Grow with Us" },
      { id: "t2", type: "text", content: "Learn about ClickTake Technologies — our mission, our multi-national team in Birmingham and Multan, our core values, and open careers." },
      { id: "b2", type: "button", content: "Browse Open Roles", meta: "#careers" }
    ]
  },
  {
    id: "services",
    name: "Services Overview",
    path: "/services",
    blocks: [
      { id: "h3", type: "header", content: "AI-Powered Systems & Digital Buildout" },
      { id: "t3", type: "text", content: "We engineer custom LLMs, high-speed Python backends, headless e-commerce, and high-conversion marketing engines." },
      { id: "b3", type: "button", content: "Get Started Kit", meta: "/services/starter-kit" }
    ]
  }
];

// 3. Media Library Database
interface MediaFile {
  id: string;
  name: string;
  type: "image" | "pdf" | "video";
  size: string;
  url: string;
}

const initialMedia: MediaFile[] = [
  { id: "m1", name: "clicktake-logo.jpg", type: "image", size: "145 KB", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80" },
  { id: "m2", name: "ai-agent-architecture.pdf", type: "pdf", size: "2.4 MB", url: "#" },
  { id: "m3", name: "promo-reel-2026.mp4", type: "video", size: "15.8 MB", url: "#" },
  { id: "m4", name: "client-testimonial-quote.jpg", type: "image", size: "320 KB", url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&q=80" },
];

// 4. Blog Posts Database
interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  status: "Published" | "Draft";
}

const initialBlogs: BlogPost[] = [
  { id: "b1", title: "Building Headless Storefronts with Shopify and Next.js", author: "Zain Paracha", date: "2026-06-01", status: "Published" },
  { id: "b2", title: "Deploying AI Agents on WhatsApp: A Complete n8n Guide", author: "Adam Kitts", date: "2026-05-28", status: "Published" },
  { id: "b3", title: "SEO Keywords Clustering in 2026: Semantic Search Mapping", author: "Hamza Farooq", date: "2026-06-10", status: "Draft" },
];

// 5. Reply Inbox Database
interface Message {
  id: string;
  sender: string;
  email: string;
  subject: string;
  body: string;
  date: string;
  replies: { sender: "Admin" | "User"; text: string; date: string }[];
}

const initialInbox: Message[] = [
  {
    id: "msg1",
    sender: "Zeeshan Khan",
    email: "zee@fastmail.pk",
    subject: "Partnership Inquiry",
    body: "Hi team, I represent a local logistics company. We want to rebuild our delivery routing app using custom AI optimization pipelines. Do you have case studies?",
    date: "10:15 AM",
    replies: [
      { sender: "User", text: "Hi team, I represent a local logistics company. We want to rebuild our delivery routing app using custom AI optimization pipelines. Do you have case studies?", date: "10:15 AM" }
    ]
  },
  {
    id: "msg2",
    sender: "Alice Rutherford",
    email: "alice.r@londonventures.co.uk",
    subject: "Website redesign cost proposal",
    body: "Could you send a pricing list or contract details for a full-stack Next.js site + custom automation workflow setup? We are planning a relaunch in Q3.",
    date: "Yesterday",
    replies: [
      { sender: "User", text: "Could you send a pricing list or contract details for a full-stack Next.js site + custom automation workflow setup? We are planning a relaunch in Q3.", date: "Yesterday" },
      { sender: "Admin", text: "Hello Alice, thanks for reaching out. We have sent our enterprise brochure to your email. I'd love to schedule a quick 15-minute call to scope this out.", date: "Yesterday" }
    ]
  }
];

// 6. Users & RBAC
interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Editor" | "Sales Support";
  status: "Active" | "Inactive";
}

const initialUsers: UserItem[] = [
  { id: "u1", name: "Zain Paracha", email: "zain@clicktake.co", role: "Super Admin", status: "Active" },
  { id: "u2", name: "Maria Qasim", email: "maria@clicktake.co", role: "Editor", status: "Active" },
  { id: "u3", name: "Hamza Farooq", email: "hamza@clicktake.co", role: "Sales Support", status: "Active" },
  { id: "u4", name: "Support Temp", email: "support@clicktake.co", role: "Sales Support", status: "Inactive" },
];

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

const initialPermissions: RolePermissions = {
  "Super Admin": { readCMS: true, editCMS: true, readLeads: true, editLeads: true, configureSMTP: true, manageRBAC: true },
  "Editor": { readCMS: true, editCMS: true, readLeads: false, editLeads: false, configureSMTP: false, manageRBAC: false },
  "Sales Support": { readCMS: true, editCMS: false, readLeads: true, editLeads: true, configureSMTP: false, manageRBAC: false },
};

export function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  // Main UI States
  const [activeTab, setActiveTab] = useState<
    "overview" | "cms" | "crm" | "email" | "rbac" | "seo" | "settings" | "security"
  >("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // CRM State
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [crmSearch, setCrmSearch] = useState("");
  const [crmStatusFilter, setCrmStatusFilter] = useState("All");
  const [crmSortField, setCrmSortField] = useState<string>("created_at");
  const [crmSortOrder, setCrmSortOrder] = useState<"asc" | "desc">("desc");
  const [newNoteText, setNewNoteText] = useState("");

  // Dynamic Dashboard Stats computed directly from real-time leads
  const dashboardStats = useMemo(() => {
    const total = leads.length;
    
    // Monthly leads
    const currentMonth = new Date().getMonth();
    const monthly = leads.filter(l => {
      const d = new Date(l.created_at);
      return !isNaN(d.getTime()) ? d.getMonth() === currentMonth : new Date().getMonth() === currentMonth;
    }).length;
    
    // Active queries (not resolved/converted/lost)
    const active = leads.filter(l => ['new', 'contacted', 'in progress'].includes((l.status || '').toLowerCase())).length;
    
    // Conversion rate
    const converted = leads.filter(l => (l.status || '').toLowerCase() === 'converted').length;
    const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) + '%' : '0%';

    // Group leads by month for the line chart
    const monthlyGroups: Record<string, { leads: number, queries: number }> = {};
    leads.forEach(l => {
      let d = new Date(l.created_at);
      if (isNaN(d.getTime())) d = new Date();
      const monthName = d.toLocaleString('default', { month: 'short' });
      if (!monthlyGroups[monthName]) monthlyGroups[monthName] = { leads: 0, queries: 0 };
      monthlyGroups[monthName].leads += 1;
      monthlyGroups[monthName].queries += (l.message ? 1 : 0);
    });
    
    // Generate Last 6 Months array
    const chartData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthName = d.toLocaleString('default', { month: 'short' });
      chartData.push({
        month: monthName,
        leads: monthlyGroups[monthName]?.leads || 0,
        queries: monthlyGroups[monthName]?.queries || 0
      });
    }

    // Traffic sources for Pie Chart (derived from source_page or interest)
    const sourceGroups: Record<string, number> = {};
    leads.forEach(l => {
      let source = l.source_page || l.service_interest || 'Direct';
      if (source === '/') source = 'Home Page';
      sourceGroups[source] = (sourceGroups[source] || 0) + 1;
    });
    
    const colors = ["#0ea5e9", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#ef4444"];
    const pieData = Object.keys(sourceGroups).map((key, index) => ({
      name: key,
      value: Math.round((sourceGroups[key] / total) * 100) || 0,
      color: colors[index % colors.length]
    }));
    
    if (pieData.length === 0) pieData.push({ name: "No Data", value: 100, color: "#333333" });

    return { total, monthly, active, conversionRate, chartData, pieData };
  }, [leads]);

  useEffect(() => {
    // Initial fetch
    const fetchLeads = async () => {
      const { data } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
        
      setLeads(data ?? []);
      if (data && data.length > 0) {
        setSelectedLeadId(data[0].id);
      }
    };
    
    fetchLeads();

    // Subscribe to new leads in real-time
    const leadsChannel = supabase
      .channel('custom-insert-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'leads' },
        async (payload) => {
          setLeads((currentLeads) => [payload.new, ...currentLeads]);
          
          // Log to audit table
          await supabase.from('audit_logs').insert({
            user_email: "System",
            action: `New Lead: ${payload.new.name} (${payload.new.service_interest || 'Inquiry'})`
          });

          setNotifications((currentNotifs) => [
            {
              id: Date.now(),
              type: "lead",
              title: "New Lead Submission:",
              message: `${payload.new.name} interest in ${payload.new.service_interest || 'General'}.`,
              time: "Just now",
              color: "text-brand-magenta"
            },
            ...currentNotifs
          ]);

          toast.success(`New Lead Inquiry from ${payload.new.name}!`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(leadsChannel);
    };
  }, []);

  // CMS State
  const [pages, setPages] = useState<CMSPage[]>(initialPages);
  const [selectedPageId, setSelectedPageId] = useState<string>("home");
  const [mediaList, setMediaList] = useState<MediaFile[]>(initialMedia);
  const [blogList, setBlogList] = useState<BlogPost[]>(initialBlogs);
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [headerLinks, setHeaderLinks] = useState<{ id: string; label: string; to: string }[]>([
    { id: "n1", label: "Home", to: "/" },
    { id: "n2", label: "Services", to: "/services" },
    { id: "n3", label: "Work", to: "/portfolio" },
    { id: "n4", label: "Resources", to: "/resources" }
  ]);
  const [newNavLink, setNewNavLink] = useState({ label: "", to: "" });

  // Email State
  const [smtpConfig, setSmtpConfig] = useState({
    server: "smtp.sendgrid.net",
    port: "587",
    user: "apikey",
    password: "••••••••••••••••••••••••",
    ssl: true,
  });
  const [emailTemplates, setEmailTemplates] = useState([
    { id: "t1", name: "Welcome Email", subject: "Welcome to ClickTake Technologies!", body: "Hi {{client_name}},\n\nThanks for reaching out! One of our engineers will review your request for {{service_interest}} and schedule a call.\n\nBest regards,\nClickTake Team" },
    { id: "t2", name: "SEO Audit Report Auto-Reply", subject: "Your technical SEO audit is ready", body: "Hi {{client_name}},\n\nHere is your custom SEO analysis. Let us know if you want to run through it together.\n\nBest,\nClickTake Marketing" }
  ]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("t1");
  const [inbox, setInbox] = useState<Message[]>(initialInbox);
  const [activeMessageId, setActiveMessageId] = useState("msg1");
  const [replyText, setReplyText] = useState("");

  // RBAC State
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [permissions, setPermissions] = useState<RolePermissions>(initialPermissions);
  const [selectedRole, setSelectedRole] = useState<"Super Admin" | "Editor" | "Sales Support">("Super Admin");
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"Super Admin" | "Editor" | "Sales Support">("Sales Support");

  // SEO State
  const [seoPages, setSeoPages] = useState({
    home: { title: "ClickTake Technologies — AI-Powered Digital Agency", desc: "ClickTake builds AI-powered websites, apps and custom automation systems." },
    about: { title: "About Us — ClickTake Technologies", desc: "Learn about ClickTake Technologies — our mission, our multi-national team in Birmingham and Multan." },
    services: { title: "Services — ClickTake Technologies", desc: "Explore our range of AI chatbots, Next.js web application buildouts, and Technical SEO." }
  });
  const [selectedSeoPage, setSelectedSeoPage] = useState<"home" | "about" | "services">("home");
  const [sitemapText, setSitemapText] = useState(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://clicktake.co/</loc><priority>1.0</priority></url>
  <url><loc>https://clicktake.co/about</loc><priority>0.8</priority></url>
  <url><loc>https://clicktake.co/services</loc><priority>0.8</priority></url>
</urlset>`);
  const [robotsText, setRobotsText] = useState(`User-agent: *
Allow: /
Sitemap: https://clicktake.co/sitemap.xml`);

  // Settings State
  const [themeAccent, setThemeAccent] = useState("magenta");
  const [contactConfig, setContactConfig] = useState({
    email: "hello@clicktake.co",
    phone: "+44 121 288 8820",
    address: "Colmore Row, Birmingham, B3 3AG, UK",
  });
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "linkedin.com/company/clicktake",
    x: "x.com/clicktake",
    github: "github.com/clicktake-tech"
  });

  // Security State
  const [rateLimit, setRateLimit] = useState(60);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);
  const [backups, setBackups] = useState([
    { id: "b1", date: "2026-06-15 03:00 AM", size: "24.5 MB", type: "Scheduled" },
    { id: "b2", date: "2026-06-14 03:00 AM", size: "24.2 MB", type: "Scheduled" },
    { id: "b3", date: "2026-06-12 11:42 AM", size: "23.9 MB", type: "Manual (Pre-Update)" },
  ]);
  const [blockedIPs, setBlockedIPs] = useState([
    { ip: "185.220.101.4", attempts: 42, reason: "SSH Bruteforce" },
    { ip: "91.240.118.25", attempts: 18, reason: "SQL Injection Probe" }
  ]);

  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [totalPageViews, setTotalPageViews] = useState<number | string>("...");

  useEffect(() => {
    // Fetch initial Page Views
    supabase.from('page_views').select('*', { count: 'exact', head: true })
      .then(({ count, error }) => {
        if (!error && count !== null) setTotalPageViews(count);
      });

    // Fetch initial Audit Logs
    supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(6)
      .then(({ data, error }) => {
        if (!error && data) {
          setAuditLogs(data.map((d: any) => ({
            id: d.id,
            user: d.user_email,
            action: d.action,
            time: new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date(d.created_at).toLocaleDateString()
          })));
        }
      });

    // Subscribe to live audit logs
    const logsChannel = supabase.channel('audit-logs-inserts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'audit_logs' }, (payload) => {
        setAuditLogs(prev => [{
          id: payload.new.id,
          user: payload.new.user_email,
          action: payload.new.action,
          time: "Just now"
        }, ...prev]);
      }).subscribe();

    return () => { supabase.removeChannel(logsChannel); };
  }, []);

  const [notifications, setNotifications] = useState<any[]>([]);

  /* ───────────────── INTERACTION HANDLERS ───────────────── */

  // CRM Handlers
  const selectedLead = useMemo(() => {
    return leads.find((l) => l.id === selectedLeadId) || leads[0];
  }, [leads, selectedLeadId]);

  const handleStatusChange = async (leadId: string, status: string) => {
    const previousLeads = [...leads];
    setLeads(leads.map((l) => (l.id === leadId ? { ...l, status } : l)));

    const leadName = leads.find((l) => l.id === leadId)?.name || "Lead";
    
    const { error } = await supabase.from('leads').update({ status }).eq('id', leadId);
    
    if (error) {
      setLeads(previousLeads);
      toast.error(`Failed to update status for ${leadName}`);
      return;
    }

    // Insert into live audit logs table
    await supabase.from('audit_logs').insert({
      user_email: user?.email || "Admin",
      action: `Changed ${leadName} status to '${status}'`
    });

    toast.success(`Updated ${leadName}'s status to ${status}`);
  };

  const handleAddNote = async () => {
    if (!newNoteText.trim() || !selectedLeadId) return;
    
    const existingNotes = Array.isArray(selectedLead?.internal_notes) ? selectedLead.internal_notes : [];
    const newNotes = [...existingNotes, newNoteText.trim()];
    
    const previousLeads = [...leads];
    setLeads(
      leads.map((l) =>
        l.id === selectedLeadId
          ? { ...l, internal_notes: newNotes }
          : l
      )
    );
    
    const { error } = await supabase.from('leads').update({ internal_notes: newNotes }).eq('id', selectedLeadId);
    
    if (error) {
      setLeads(previousLeads);
      toast.error("Failed to save note. Check database permissions.");
      return;
    }

    setNewNoteText("");
    toast.success("Note saved successfully");
  };

  const handleExportCSV = () => {
    try {
      const headers = ['Name', 'Email', 'Phone', 'Service Interest', 'Source', 'Status', 'Date', 'Message'];
      const csvContent = [
        headers.join(','),
        ...filteredLeads.map(lead => [
          `"${lead.name || ''}"`,
          `"${lead.email || ''}"`,
          `"${lead.phone || ''}"`,
          `"${lead.service_interest || ''}"`,
          `"${lead.source_page || ''}"`,
          `"${lead.status || ''}"`,
          `"${lead.created_at || ''}"`,
          `"${(lead.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'clicktake_leads.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Leads exported successfully!");
    } catch (err) {
      toast.error("Failed to generate CSV export");
    }
  };

  const filteredLeads = useMemo(() => {
    return leads
      .filter((l) => {
        const interestStr = (l.interest || l.service_interest || "").toLowerCase();
        const statusStr = (l.status || "").toLowerCase();
        
        const matchesSearch =
          (l.name || "").toLowerCase().includes(crmSearch.toLowerCase()) ||
          (l.email || "").toLowerCase().includes(crmSearch.toLowerCase()) ||
          interestStr.includes(crmSearch.toLowerCase());
        const matchesStatus = crmStatusFilter === "All" || statusStr === crmStatusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let fieldA = a[crmSortField];
        let fieldB = b[crmSortField];
        if (typeof fieldA === "string" && typeof fieldB === "string") {
          return crmSortOrder === "asc"
            ? fieldA.localeCompare(fieldB)
            : fieldB.localeCompare(fieldA);
        }
        return 0;
      });
  }, [leads, crmSearch, crmStatusFilter, crmSortField, crmSortOrder]);

  // CMS Handlers
  const selectedPage = useMemo(() => {
    return pages.find((p) => p.id === selectedPageId) || pages[0];
  }, [pages, selectedPageId]);

  const handleUpdateBlockContent = (blockId: string, newText: string) => {
    setPages(
      pages.map((p) =>
        p.id === selectedPageId
          ? {
              ...p,
              blocks: p.blocks.map((b) => (b.id === blockId ? { ...b, content: newText } : b))
            }
          : p
      )
    );
  };

  const handleUpdateBlockMeta = (blockId: string, newMeta: string) => {
    setPages(
      pages.map((p) =>
        p.id === selectedPageId
          ? {
              ...p,
              blocks: p.blocks.map((b) => (b.id === blockId ? { ...b, meta: newMeta } : b))
            }
          : p
      )
    );
  };

  const handleSavePage = () => {
    toast.success(`${selectedPage.name} layout published to production!`);
    setAuditLogs([
      { id: Date.now(), user: "Super Admin", action: `Published changes to page: ${selectedPage.name}`, time: "Just now" },
      ...auditLogs
    ]);
  };

  const handleAddMediaMock = () => {
    const randomImg = [
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80"
    ][Math.floor(Math.random() * 2)];

    const newMediaItem: MediaFile = {
      id: `m${Date.now()}`,
      name: `screenshot_${Math.floor(Math.random() * 1000)}.jpg`,
      type: "image",
      size: "248 KB",
      url: randomImg
    };

    setMediaList([...mediaList, newMediaItem]);
    toast.success("Uploaded mock asset to Media Library");
  };

  const handleDeleteMedia = (id: string) => {
    setMediaList(mediaList.filter((m) => m.id !== id));
    toast.error("Asset deleted from Media Library");
  };

  const handleAddBlogPost = () => {
    if (!newBlogTitle.trim()) return;
    const newPost: BlogPost = {
      id: `b${Date.now()}`,
      title: newBlogTitle.trim(),
      author: "Super Admin",
      date: new Date().toISOString().split("T")[0],
      status: "Draft"
    };
    setBlogList([newPost, ...blogList]);
    setNewBlogTitle("");
    toast.success("Blog post draft created successfully");
  };

  const handleDeleteBlog = (id: string) => {
    setBlogList(blogList.filter((b) => b.id !== id));
    toast.error("Blog post deleted");
  };

  const handleAddNavLink = () => {
    if (!newNavLink.label || !newNavLink.to) return;
    setHeaderLinks([...headerLinks, { id: `n${Date.now()}`, ...newNavLink }]);
    setNewNavLink({ label: "", to: "" });
    toast.success("Link added to website header navigation");
  };

  // Email Handlers
  const selectedTemplate = useMemo(() => {
    return emailTemplates.find((t) => t.id === selectedTemplateId) || emailTemplates[0];
  }, [emailTemplates, selectedTemplateId]);

  const handleUpdateTemplate = (subject: string, body: string) => {
    setEmailTemplates(
      emailTemplates.map((t) =>
        t.id === selectedTemplateId ? { ...t, subject, body } : t
      )
    );
  };

  const activeMessage = useMemo(() => {
    return inbox.find((m) => m.id === activeMessageId) || inbox[0];
  }, [inbox, activeMessageId]);

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    const updatedInbox = inbox.map((m) => {
      if (m.id === activeMessageId) {
        return {
          ...m,
          replies: [...m.replies, { sender: "Admin" as const, text: replyText.trim(), date: "Just now" }]
        };
      }
      return m;
    });
    setInbox(updatedInbox);
    setReplyText("");
    toast.success("Reply dispatched via SMTP relay");
  };

  const handleTestSMTP = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: "Reaching SMTP server and sending ping...",
        success: "SMTP connection healthy! Handshake completed in 420ms.",
        error: "Handshake failed",
      }
    );
  };

  // RBAC Handlers
  const handlePermissionToggle = (role: string, permissionKey: keyof typeof initialPermissions["Editor"]) => {
    setPermissions({
      ...permissions,
      [role]: {
        ...permissions[role],
        [permissionKey]: !permissions[role][permissionKey]
      }
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
      status: "Active"
    };
    setUsers([...users, newUser]);
    setNewUserName("");
    setNewUserEmail("");
    toast.success(`User ${newUser.name} registered as ${newUser.role}`);
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(
      users.map((u) =>
        u.id === userId ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u
      )
    );
    toast.info("Toggled user state");
  };

  // 2FA Verification Handler
  const handleVerify2FA = () => {
    setIsOtpVerifying(true);
    setTimeout(() => {
      setIsOtpVerifying(false);
      if (otpInput === "123456") {
        setTwoFactorEnabled(true);
        setOtpInput("");
        toast.success("Two-Factor Authentication (2FA) is now ENABLED.");
      } else {
        toast.error("Incorrect verification code. Please try again.");
      }
    }, 1000);
  };

  // Backup handlers
  const handleCreateBackup = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1200)),
      {
        loading: "Running file backup & database snapshot...",
        success: () => {
          const newBackup = {
            id: `b${Date.now()}`,
            date: new Date().toLocaleString(),
            size: `${(24.0 + Math.random()).toFixed(1)} MB`,
            type: "Manual"
          };
          setBackups([newBackup, ...backups]);
          return "Backup successfully saved to storage cluster.";
        },
        error: "Backup failed"
      }
    );
  };

  const handleRestoreBackup = (id: string) => {
    const backup = backups.find((b) => b.id === id);
    if (!confirm(`Warning: Restoring the backup from ${backup?.date} will overwrite current database state. Proceed?`)) return;
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: "Halting server queries, rebuilding database state...",
        success: "System state restored to backup checkpoint successfully!",
        error: "Restoration failed"
      }
    );
  };

  // Custom styling tokens matching clicktake design guidelines
  const activeColorTheme = useMemo(() => {
    return themeAccent === "magenta"
      ? "from-brand-magenta to-brand-blue"
      : themeAccent === "pink"
      ? "from-brand-pink to-brand-magenta"
      : themeAccent === "cyan"
      ? "from-brand-cyan to-brand-blue"
      : "from-brand-pink to-brand-cyan";
  }, [themeAccent]);

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

            {/* Logo area */}
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

              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-card p-3 shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200">
                <div className="text-xs font-bold border-b border-border pb-2 mb-2">Recent Notifications</div>
                <div className="space-y-2.5 max-h-60 overflow-y-auto">
                  {notifications.map((n, idx) => (
                    <div key={n.id} className={`text-[11px] leading-normal ${idx > 0 ? 'border-t border-border/40 pt-2' : ''}`}>
                      <span className={`font-semibold ${n.color}`}>{n.title}</span> {n.message}
                      <div className="text-[9px] text-muted-foreground">{n.time}</div>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="text-[11px] text-muted-foreground text-center py-4">No new notifications</div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Dropdown */}
            <div className="flex items-center gap-2 border-l border-border pl-3">
              <div className="h-8 w-8 rounded-full bg-linear-to-tr from-brand-pink to-brand-magenta flex items-center justify-center text-white text-xs font-bold shadow-md">
                {(user?.email ?? "A").charAt(0).toUpperCase()}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold leading-tight">{user?.email ?? "Administrator"}</div>
                <div className="text-[9px] text-muted-foreground font-medium">{user?.role ?? "Admin"}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Workspace */}
      <div className="flex min-h-[calc(100vh-64px)] relative">
        
        {/* Left Sidebar Navigation */}
        <aside
          className={`shrink-0 border-r border-border/80 bg-card/40 backdrop-blur-xl transition-all duration-300 ${
            isSidebarCollapsed ? "w-16" : "w-64"
          }`}
        >
          <div className="flex flex-col gap-1 p-3">
            {[
              { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
              { id: "cms", label: "CMS Management", icon: FileText },
              { id: "crm", label: "Lead CRM", icon: Users },
              { id: "email", label: "Email Center", icon: Mail },
              { id: "rbac", label: "User Roles (RBAC)", icon: Shield },
              { id: "seo", label: "SEO & Analytics", icon: Globe },
              { id: "settings", label: "Config Settings", icon: Settings },
              { id: "security", label: "Security & Logs", icon: ShieldAlert },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`group flex items-center gap-3 rounded-xl px-4 py-3.5 text-left text-xs font-bold transition-all ${
                    isActive
                      ? `bg-linear-to-r ${activeColorTheme} text-white shadow-glow`
                      : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <TabIcon className={`h-4.5 w-4.5 ${isActive ? "text-white" : "group-hover:scale-105 transition-transform"}`} />
                  {!isSidebarCollapsed && <span>{tab.label}</span>}
                </button>
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

        {/* Dashboard Panels Container */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full relative z-10">
          
          <AnimatePresence mode="wait">
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === "overview" && (
              <motion.div
                key="overview"
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
                    { label: "Total Leads", val: dashboardStats.total, trend: "Live", status: "up", color: "from-cyan-500/10 to-blue-500/10" },
                    { label: "Monthly Leads", val: dashboardStats.monthly, trend: "Live", status: "up", color: "from-violet-500/10 to-fuchsia-500/10" },
                    { label: "Active Queries", val: dashboardStats.active, trend: "Live", status: "down", color: "from-amber-500/10 to-orange-500/10" },
                    { label: "Conversion Rate", val: dashboardStats.conversionRate, trend: "Live", status: "up", color: "from-emerald-500/10 to-teal-500/10" },
                    { label: "Total Page Views", val: totalPageViews, trend: "Live", status: "up", color: "from-pink-500/10 to-rose-500/10" },
                  ].map((card, idx) => (
                    <div
                      key={idx}
                      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl hover:border-white/20 transition-all duration-300`}
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
                        <span className="text-muted-foreground font-normal">Real-time</span>
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
                          <LineChart data={dashboardStats.chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" opacity={0.3} />
                            <XAxis dataKey="month" stroke="#71717a" fontSize={10} tickLine={false} />
                            <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                            <ChartTooltip
                              contentStyle={{ background: "rgba(20,20,20,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "11px" }}
                            />
                            <Line
                              type="monotone"
                              dataKey="leads"
                              stroke="oklch(0.55 0.28 330)"
                              strokeWidth={3}
                              dot={{ r: 4, strokeWidth: 2 }}
                            />
                            <Line
                              type="monotone"
                              dataKey="queries"
                              stroke="oklch(0.75 0.15 220)"
                              strokeWidth={2}
                              strokeDasharray="4 4"
                              dot={false}
                            />
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
                            <Pie
                              data={dashboardStats.pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={70}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {dashboardStats.pieData.map((entry, index) => (
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
                      <div className="absolute text-center pointer-events-none">
                        <div className="text-lg font-bold">{dashboardStats.total}</div>
                        <div className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Leads</div>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      {dashboardStats.pieData.map((ch, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: ch.color }} />
                          <span className="text-muted-foreground truncate">{ch.name}</span>
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
                        <button
                          onClick={() => { setActiveTab("cms"); setSelectedPageId("home"); }}
                          className="w-full flex items-center justify-between rounded-xl bg-white/5 border border-white/5 p-3 hover:bg-white/10 transition-all text-xs font-bold"
                        >
                          <span className="flex items-center gap-2">
                            <Plus className="h-4 w-4 text-brand-magenta" />
                            Add New Page Section
                          </span>
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                        
                        <button
                          onClick={() => { setActiveTab("crm"); }}
                          className="w-full flex items-center justify-between rounded-xl bg-white/5 border border-white/5 p-3 hover:bg-white/10 transition-all text-xs font-bold"
                        >
                          <span className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-brand-cyan" />
                            Review CRM Submissions
                          </span>
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>

                        <button
                          onClick={() => { setActiveTab("email"); }}
                          className="w-full flex items-center justify-between rounded-xl bg-white/5 border border-white/5 p-3 hover:bg-white/10 transition-all text-xs font-bold"
                        >
                          <span className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-brand-pink" />
                            Send Bulk Email Blast
                          </span>
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
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
                      {auditLogs.length > 0 ? auditLogs.map((log) => (
                        <div key={log.id} className="flex items-start justify-between border-b border-white/5 pb-2.5 last:border-b-0 last:pb-0">
                          <div className="flex items-start gap-3">
                            <div className="h-2 w-2 rounded-full bg-brand-magenta mt-1.5 shrink-0" />
                            <div>
                              <p className="text-xs font-semibold leading-normal">{log.action}</p>
                              <p className="text-[10px] text-muted-foreground">Triggered by <span className="text-foreground">{log.user}</span></p>
                            </div>
                          </div>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">{log.time}</span>
                        </div>
                      )) : (
                        <div className="text-[11px] text-muted-foreground py-4">Waiting for table creation / No recent activity.</div>
                      )}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* 2. CMS MANAGEMENT TAB */}
            {activeTab === "cms" && (
              <motion.div
                key="cms"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="font-display text-2xl font-bold tracking-tight">CMS Website Engine</h1>
                  <p className="text-xs text-muted-foreground mt-1">
                    Manage pages, layout blocks, assets, and navigation menus.
                  </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-4">
                  
                  {/* Page Manager Sidebar */}
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center justify-between">
                        <span>Active Pages</span>
                        <Plus className="h-3.5 w-3.5 text-brand-magenta cursor-pointer hover:scale-110 transition-transform" />
                      </div>
                      <div className="space-y-1.5">
                        {pages.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => setSelectedPageId(p.id)}
                            className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                              selectedPageId === p.id
                                ? "bg-white/10 text-white border-l-2 border-brand-magenta"
                                : "text-muted-foreground hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <span>{p.name}</span>
                            <span className="text-[9px] font-mono text-muted-foreground">{p.path}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Blog posts list manager */}
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                        Blog & News Feed
                      </div>
                      <div className="space-y-2">
                        {blogList.map((blog) => (
                          <div key={blog.id} className="flex items-center justify-between rounded-xl bg-white/5 p-2.5 text-[11px]">
                            <div className="overflow-hidden mr-2">
                              <p className="font-semibold truncate leading-snug">{blog.title}</p>
                              <span className="text-[9px] text-muted-foreground">{blog.date} • {blog.status}</span>
                            </div>
                            <button
                              onClick={() => handleDeleteBlog(blog.id)}
                              className="text-muted-foreground hover:text-rose-400 p-1 shrink-0"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <input
                          type="text"
                          placeholder="New post title..."
                          value={newBlogTitle}
                          onChange={(e) => setNewBlogTitle(e.target.value)}
                          className="flex-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-[11px] focus:outline-none"
                        />
                        <button
                          onClick={handleAddBlogPost}
                          className="rounded-lg bg-brand-magenta text-white px-3 text-[11px] font-bold"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Visual Canvas layout editor */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl">
                      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Visual Editor Canvas
                          </h3>
                          <p className="text-[10px] text-muted-foreground">Selected page: <span className="text-foreground font-semibold">{selectedPage.name}</span></p>
                        </div>
                        <button
                          onClick={handleSavePage}
                          className="flex items-center gap-1.5 rounded-xl bg-linear-to-r from-brand-magenta to-brand-blue px-4 py-2 text-xs font-semibold text-white shadow-md hover:scale-102 transition"
                        >
                          <Save className="h-3.5 w-3.5" /> Save layout
                        </button>
                      </div>

                      {/* Canvas Simulator Area */}
                      <div className="border border-white/5 bg-background/50 rounded-xl p-4 space-y-4 max-h-[380px] overflow-y-auto min-h-[300px]">
                        
                        <div className="text-[9px] uppercase tracking-widest text-muted-foreground border-b border-white/5 pb-1 font-bold">
                          Live Render Preview
                        </div>

                        {selectedPage.blocks.map((block) => (
                          <div
                            key={block.id}
                            className="group relative border border-dashed border-white/10 hover:border-brand-magenta/40 p-4 rounded-xl transition"
                          >
                            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                              <span className="text-[9px] uppercase font-mono bg-white/10 px-1.5 py-0.5 rounded text-muted-foreground">
                                {block.type}
                              </span>
                            </div>

                            {/* Render block depending on type */}
                            {block.type === "header" && (
                              <h2 className="font-display text-xl font-bold tracking-tight text-gradient">
                                {block.content}
                              </h2>
                            )}

                            {block.type === "text" && (
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {block.content}
                              </p>
                            )}

                            {block.type === "button" && (
                              <div className="pt-2">
                                <span className="inline-flex rounded-full bg-gradient-brand px-4 py-1.5 text-[11px] font-bold text-white shadow">
                                  {block.content}
                                </span>
                                <span className="ml-2 text-[9px] text-muted-foreground font-mono">({block.meta})</span>
                              </div>
                            )}

                            {/* Block form controls inside canvas */}
                            <div className="mt-3 hidden group-hover:block border-t border-white/5 pt-3">
                              <label className="block text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Edit Content</label>
                              <input
                                type="text"
                                value={block.content}
                                onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                                className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none"
                              />
                              {block.type === "button" && (
                                <div className="mt-2">
                                  <label className="block text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Button Link (to)</label>
                                  <input
                                    type="text"
                                    value={block.meta || ""}
                                    onChange={(e) => handleUpdateBlockMeta(block.id, e.target.value)}
                                    className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none"
                                  />
                                </div>
                              )}
                            </div>

                          </div>
                        ))}

                      </div>
                    </div>
                  </div>

                  {/* Media Library & Menus */}
                  <div className="space-y-4">
                    
                    {/* Media Grid */}
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Media Library</div>
                        <button
                          onClick={handleAddMediaMock}
                          className="flex items-center gap-1 rounded-lg bg-white/5 border border-white/5 px-2 py-1 text-[10px] hover:bg-white/10 font-bold"
                        >
                          <Upload className="h-3 w-3" /> Upload
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                        {mediaList.map((file) => (
                          <div key={file.id} className="relative group rounded-lg border border-white/5 overflow-hidden bg-background">
                            {file.type === "image" ? (
                              <img src={file.url} className="h-16 w-full object-cover" alt="" />
                            ) : (
                              <div className="h-16 w-full flex items-center justify-center bg-white/5 text-[10px] font-bold">
                                {file.type.toUpperCase()}
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col justify-between p-1 transition-all">
                              <span className="text-[8px] text-white truncate">{file.name}</span>
                              <div className="flex items-center justify-between mt-auto">
                                <span className="text-[7px] text-muted-foreground">{file.size}</span>
                                <Trash2
                                  className="h-3 w-3 text-rose-400 cursor-pointer hover:scale-110"
                                  onClick={() => handleDeleteMedia(file.id)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Navigation Menu Editor */}
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                        Header Navigation Menu
                      </div>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto mb-3 pr-1">
                        {headerLinks.map((link) => (
                          <div key={link.id} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-1.5 text-[11px]">
                            <span className="font-semibold">{link.label}</span>
                            <span className="font-mono text-muted-foreground text-[9px]">{link.to}</span>
                            <Trash2
                              className="h-3 w-3 text-muted-foreground hover:text-rose-400 cursor-pointer"
                              onClick={() => setHeaderLinks(headerLinks.filter((l) => l.id !== link.id))}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2 border-t border-white/5 pt-3">
                        <div className="grid grid-cols-2 gap-1.5">
                          <input
                            type="text"
                            placeholder="Label"
                            value={newNavLink.label}
                            onChange={(e) => setNewNavLink({ ...newNavLink, label: e.target.value })}
                            className="rounded-lg border border-border bg-background px-2 py-1 text-[10px]"
                          />
                          <input
                            type="text"
                            placeholder="Route"
                            value={newNavLink.to}
                            onChange={(e) => setNewNavLink({ ...newNavLink, to: e.target.value })}
                            className="rounded-lg border border-border bg-background px-2 py-1 text-[10px]"
                          />
                        </div>
                        <button
                          onClick={handleAddNavLink}
                          className="w-full rounded-lg bg-brand-blue text-white py-1.5 text-[10px] font-bold shadow-md"
                        >
                          Add Navigation Link
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. CRM TAB */}
            {activeTab === "crm" && (
              <motion.div
                key="crm"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="font-display text-2xl font-bold tracking-tight">Lead Management CRM</h1>
                    <p className="text-xs text-muted-foreground mt-1">
                      Process service inquiries and track user acquisitions.
                    </p>
                  </div>

                  <button
                    onClick={handleExportCSV}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-emerald-700 transition"
                  >
                    <FileSpreadsheet className="h-4 w-4" /> Export Leads Database
                  </button>
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
                      className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Status:</span>
                    <select
                      value={crmStatusFilter}
                      onChange={(e) => setCrmStatusFilter(e.target.value)}
                      className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs focus:outline-none text-foreground"
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
                  
                  {/* Table */}
                  <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-card/40 backdrop-blur-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 bg-white/2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            <th className="p-4">Client</th>
                            <th className="p-4">Interest</th>
                            <th className="p-4">Submission Date</th>
                            <th className="p-4">Source</th>
                            <th className="p-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-xs">
                          {leads.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="p-8 text-center text-muted-foreground text-xs">
                                No leads yet. Leads will appear here when contact forms are submitted.
                              </td>
                            </tr>
                          ) : filteredLeads.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="p-8 text-center text-muted-foreground text-xs">
                                No leads match your filters.
                              </td>
                            </tr>
                          ) : (
                            filteredLeads.map((lead) => (
                              <tr
                                key={lead.id}
                                onClick={() => setSelectedLeadId(lead.id)}
                                className={`cursor-pointer hover:bg-white/5 transition-colors ${
                                  selectedLeadId === lead.id ? "bg-white/5" : ""
                                }`}
                              >
                                <td className="p-4">
                                  <div className="font-bold">{lead.name}</div>
                                  <div className="text-[10px] text-muted-foreground mt-0.5">{lead.email}</div>
                                </td>
                                <td className="p-4 font-semibold">{lead.interest || lead.service_interest || "N/A"}</td>
                                <td className="p-4 text-muted-foreground font-mono">
                                  {lead.date || (!isNaN(new Date(lead.created_at).getTime()) ? new Date(lead.created_at).toLocaleDateString() : new Date().toLocaleDateString())}
                                </td>
                                <td className="p-4 text-muted-foreground">{lead.source || lead.source_page || "Direct"}</td>
                                <td className="p-4">
                                  <select
                                    value={lead.status || "new"}
                                    onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                                    onClick={(e) => e.stopPropagation()}
                                    className={`rounded-lg px-2 py-1 text-[10px] font-bold focus:outline-none border border-transparent ${
                                      (lead.status || "new").toLowerCase() === "new"
                                        ? "bg-cyan-500/10 text-cyan-400"
                                        : (lead.status || "").toLowerCase() === "contacted"
                                        ? "bg-blue-500/10 text-blue-400"
                                        : (lead.status || "").toLowerCase() === "in progress"
                                        ? "bg-violet-500/10 text-violet-400"
                                        : (lead.status || "").toLowerCase() === "converted"
                                        ? "bg-emerald-500/10 text-emerald-400"
                                        : "bg-rose-500/10 text-rose-400"
                                    }`}
                                  >
                                    <option value="new">New</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="in progress">In Progress</option>
                                    <option value="converted">Converted</option>
                                    <option value="lost">Lost</option>
                                  </select>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Notes & Details Sidebar */}
                  <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl flex flex-col justify-between">
                    {selectedLead ? (
                      <>
                        <div>
                          <div className="border-b border-white/5 pb-3 mb-4">
                            <div className="text-[10px] uppercase font-bold text-brand-magenta">Lead Details</div>
                            <h3 className="text-sm font-bold mt-1">{selectedLead.name}</h3>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{selectedLead.phone || "No phone"} • {selectedLead.email}</p>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Interest area</span>
                              <span className="text-xs font-bold mt-1 block">{selectedLead.interest || selectedLead.service_interest || "N/A"}</span>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Acquisition channel</span>
                              <span className="text-xs font-bold mt-1 block">{selectedLead.source || selectedLead.source_page || "Direct"}</span>
                            </div>

                            <div>
                              <span className="text-[10px] uppercase font-semibold text-muted-foreground block mb-2">Internal Admin Comments</span>
                              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                                {(Array.isArray(selectedLead.internal_notes) ? selectedLead.internal_notes : []).map((note: string, index: number) => (
                                  <div key={index} className="bg-white/5 border border-white/5 rounded-xl p-2.5 text-[10px] leading-relaxed relative">
                                    {note}
                                    <span className="absolute bottom-1 right-2 text-[8px] text-muted-foreground">Admin Note</span>
                                  </div>
                                ))}
                                {selectedLead.message && (
                                  <div className="bg-white/5 border border-white/5 rounded-xl p-2.5 text-[10px] leading-relaxed relative">
                                    {selectedLead.message}
                                    <span className="absolute bottom-1 right-2 text-[8px] text-muted-foreground">User Message</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-white/5 pt-4 mt-4 space-y-2">
                          <textarea
                            rows={2}
                            placeholder="Write internal team notes here..."
                            value={newNoteText}
                            onChange={(e) => setNewNoteText(e.target.value)}
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none resize-none"
                          />
                          <button
                            onClick={handleAddNote}
                            className="w-full rounded-xl bg-brand-magenta text-white py-2 text-xs font-bold shadow-md hover:scale-102 transition"
                          >
                            Append Admin Comment
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-muted-foreground text-xs text-center">
                        Select a lead to view details or wait for new inquiries.
                      </div>
                    )}
                  </div>

                </div>
              </motion.div>
            )}

            {/* 4. EMAIL CENTER TAB */}
            {activeTab === "email" && (
              <motion.div
                key="email"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="font-display text-2xl font-bold tracking-tight">Email Communication Center</h1>
                  <p className="text-xs text-muted-foreground mt-1">
                    SMTP configurations, template building, and real-time message response.
                  </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  
                  {/* SMTP Settings & templates editor */}
                  <div className="space-y-6">
                    
                    {/* SMTP config form */}
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">SMTP Relay Config</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase">Outgoing SMTP Server</label>
                          <input
                            type="text"
                            value={smtpConfig.server}
                            onChange={(e) => setSmtpConfig({ ...smtpConfig, server: e.target.value })}
                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase">Server Port</label>
                            <input
                              type="text"
                              value={smtpConfig.port}
                              onChange={(e) => setSmtpConfig({ ...smtpConfig, port: e.target.value })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase">SSL Security</label>
                            <button
                              onClick={() => setSmtpConfig({ ...smtpConfig, ssl: !smtpConfig.ssl })}
                              className={`w-full flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold ${
                                smtpConfig.ssl ? "bg-brand-magenta/10 border-brand-magenta text-brand-magenta" : "border-border text-muted-foreground"
                              }`}
                            >
                              {smtpConfig.ssl ? "SSL Encrypted" : "TLS / Unsecure"}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase">Relay Username</label>
                          <input
                            type="text"
                            value={smtpConfig.user}
                            onChange={(e) => setSmtpConfig({ ...smtpConfig, user: e.target.value })}
                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={handleTestSMTP}
                            className="flex-1 rounded-xl bg-white/5 border border-white/5 py-2 text-xs font-bold hover:bg-white/10"
                          >
                            Test Connection
                          </button>
                          <button
                            onClick={() => toast.success("SMTP config saved successfully")}
                            className="flex-1 rounded-xl bg-brand-magenta text-white py-2 text-xs font-bold"
                          >
                            Save Settings
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Automation workflows list */}
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Autoresponder Workflows</h3>
                      <div className="space-y-2.5">
                        {[
                          { title: "Lead Form auto-responder", desc: "Instant response with Welcome Template" },
                          { title: "SEO audit report dispatch", desc: "Triggers on custom SEO request" },
                          { title: "24-Hour Lead follow-up", desc: "Fires 24h post-sub if status is New" }
                        ].map((wf, idx) => (
                          <div key={idx} className="flex items-center justify-between rounded-xl bg-white/5 p-3 text-xs">
                            <div>
                              <p className="font-semibold">{wf.title}</p>
                              <span className="text-[9px] text-muted-foreground">{wf.desc}</span>
                            </div>
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Direct Reply Inbox */}
                  <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-card/40 backdrop-blur-xl overflow-hidden flex flex-col min-h-[480px]">
                    <div className="flex flex-1 divide-x divide-white/5">
                      
                      {/* Conversations sidebar list */}
                      <div className="w-1/3 p-4 space-y-3">
                        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Conversations</div>
                        <div className="space-y-2">
                          {inbox.map((msg) => {
                            const isSelected = activeMessageId === msg.id;
                            return (
                              <button
                                key={msg.id}
                                onClick={() => setActiveMessageId(msg.id)}
                                className={`w-full text-left rounded-xl p-3 border transition ${
                                  isSelected
                                    ? "bg-white/10 border-brand-magenta text-white"
                                    : "border-transparent text-muted-foreground hover:bg-white/5 hover:text-white"
                                }`}
                              >
                                <div className="font-bold text-xs truncate">{msg.sender}</div>
                                <div className="text-[10px] truncate mt-0.5 font-semibold text-foreground">{msg.subject}</div>
                                <div className="text-[8px] mt-1 text-muted-foreground text-right">{msg.date}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Chat Pane */}
                      <div className="flex-1 flex flex-col justify-between p-4 bg-background/20">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                          <div>
                            <div className="text-xs font-bold">{activeMessage.sender}</div>
                            <div className="text-[9px] text-muted-foreground">{activeMessage.email}</div>
                          </div>
                          <span className="text-[10px] font-semibold text-muted-foreground">Subject: {activeMessage.subject}</span>
                        </div>

                        {/* Message history */}
                        <div className="flex-1 overflow-y-auto space-y-3 my-4 pr-1 max-h-[260px]">
                          {activeMessage.replies.map((reply, index) => {
                            const isAdmin = reply.sender === "Admin";
                            return (
                              <div
                                key={index}
                                className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                              >
                                <div
                                  className={`rounded-2xl px-4 py-2 text-xs max-w-xs leading-relaxed ${
                                    isAdmin
                                      ? "bg-gradient-brand text-white"
                                      : "bg-white/10 text-foreground"
                                  }`}
                                >
                                  {reply.text}
                                  <div className="text-[8px] mt-1 text-right text-white/50">{reply.date}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Send Reply box */}
                        <div className="border-t border-white/5 pt-3 flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Type SMTP message reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
                            className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-xs focus:outline-none"
                          />
                          <button
                            onClick={handleSendReply}
                            className="rounded-xl bg-gradient-brand text-white p-2.5 shadow-md hover:scale-105 transition"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        </div>

                      </div>

                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* 5. USER AND ROLE MANAGEMENT TAB */}
            {activeTab === "rbac" && (
              <motion.div
                key="rbac"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="font-display text-2xl font-bold tracking-tight">RBAC Security Controls</h1>
                  <p className="text-xs text-muted-foreground mt-1">
                    Manage administrative team members and configure role-based access permissions.
                  </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  
                  {/* Left Column: Role Details & Permission switches */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* Role cards selection */}
                    <div className="grid gap-4 sm:grid-cols-3">
                      {[
                        { role: "Super Admin" as const, desc: "Owner level privilege access, full SMTP, database, and system overrides." },
                        { role: "Editor" as const, desc: "Content operator privilege. Manage layout files, media library assets, sitemaps." },
                        { role: "Sales Support" as const, desc: "Operational agent access. Review leads database, reply messages, write notes." },
                      ].map((item) => {
                        const isSelected = selectedRole === item.role;
                        return (
                          <div
                            key={item.role}
                            onClick={() => setSelectedRole(item.role)}
                            className={`cursor-pointer rounded-2xl border p-4 backdrop-blur-xl transition ${
                              isSelected
                                ? "border-brand-magenta bg-brand-magenta/5 shadow-glow text-white"
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
                          <div className="text-[10px] text-muted-foreground">Role configured: <span className="text-foreground font-bold">{selectedRole}</span></div>
                        </div>
                        <Shield className="h-4 w-4 text-brand-magenta" />
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {[
                          { key: "readCMS" as const, label: "View Page Layouts" },
                          { key: "editCMS" as const, label: "Edit/Publish Pages" },
                          { key: "readLeads" as const, label: "View CRM Leads" },
                          { key: "editLeads" as const, label: "Edit Lead Pipeline" },
                          { key: "configureSMTP" as const, label: "Manage SMTP relays" },
                          { key: "manageRBAC" as const, label: "System configurations" },
                        ].map((perm) => {
                          const val = permissions[selectedRole][perm.key];
                          return (
                            <div key={perm.key} className="flex items-center justify-between rounded-xl bg-white/5 p-3 text-xs">
                              <span className="font-semibold">{perm.label}</span>
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
                              <p className="font-semibold leading-none">{u.name}</p>
                              <span className="text-[9px] text-muted-foreground">{u.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/10">{u.role}</span>
                              <button
                                onClick={() => handleToggleUserStatus(u.id)}
                                className={`h-2.5 w-2.5 rounded-full ${u.status === "Active" ? "bg-emerald-400" : "bg-rose-500"}`}
                                title={u.status}
                              />
                            </div>
                          </div>
                        ))}
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
                            className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none"
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
                            className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-muted-foreground mb-1 uppercase font-semibold">Security Role</label>
                          <select
                            value={newUserRole}
                            onChange={(e) => setNewUserRole(e.target.value as any)}
                            className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs focus:outline-none"
                          >
                            <option value="Super Admin">Super Admin</option>
                            <option value="Editor">Editor</option>
                            <option value="Sales Support">Sales Support</option>
                          </select>
                        </div>
                        <button
                          type="submit"
                          className="w-full rounded-xl bg-gradient-brand text-white py-2 text-xs font-bold shadow-md hover:scale-102 transition"
                        >
                          Register User
                        </button>
                      </form>
                    </div>

                  </div>

                </div>
              </motion.div>
            )}

            {/* 6. SEO & ANALYTICS TAB */}
            {activeTab === "seo" && (
              <motion.div
                key="seo"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="font-display text-2xl font-bold tracking-tight">SEO Engine & Search Console</h1>
                  <p className="text-xs text-muted-foreground mt-1">
                    Manage meta configurations and inspect organic analytics tracking.
                  </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  
                  {/* Meta tag editor */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl">
                      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">SEO Meta Tags Manager</h3>
                        <select
                          value={selectedSeoPage}
                          onChange={(e: any) => setSelectedSeoPage(e.target.value)}
                          className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none"
                        >
                          <option value="home">Home Page</option>
                          <option value="about">About Us</option>
                          <option value="services">Services</option>
                        </select>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] text-muted-foreground mb-1 uppercase font-semibold">Meta Title Tag</label>
                          <input
                            type="text"
                            value={seoPages[selectedSeoPage].title}
                            onChange={(e) => setSeoPages({
                              ...seoPages,
                              [selectedSeoPage]: { ...seoPages[selectedSeoPage], title: e.target.value }
                            })}
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-muted-foreground mb-1 uppercase font-semibold">Meta Description Tag</label>
                          <textarea
                            rows={3}
                            value={seoPages[selectedSeoPage].desc}
                            onChange={(e) => setSeoPages({
                              ...seoPages,
                              [selectedSeoPage]: { ...seoPages[selectedSeoPage], desc: e.target.value }
                            })}
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none resize-none"
                          />
                        </div>

                        {/* Live Google Search Engine Result Preview Mockup */}
                        <div className="border border-white/5 bg-background/60 rounded-xl p-4 mt-2">
                          <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mb-3">Google SERP Preview Snippet</div>
                          <div className="font-sans text-left">
                            <span className="text-[11px] text-[#202124] dark:text-[#dadce0] block truncate">https://clicktake.co</span>
                            <span className="text-sm text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer font-medium block mt-1 truncate">
                              {seoPages[selectedSeoPage].title}
                            </span>
                            <span className="text-xs text-[#4d5156] dark:text-[#bdc1c6] block mt-1 leading-normal">
                              {seoPages[selectedSeoPage].desc}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => toast.success("Meta tags updated across cloud servers!")}
                          className="w-full rounded-xl bg-brand-magenta text-white py-2.5 text-xs font-bold shadow-md"
                        >
                          Sync Google Meta Configuration
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sitemap & Robots.txt editors */}
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center justify-between">
                        <span>sitemap.xml</span>
                        <Save className="h-3.5 w-3.5 text-brand-magenta cursor-pointer" onClick={() => toast.success("Sitemap XML rebuilt!")} />
                      </div>
                      <textarea
                        rows={5}
                        value={sitemapText}
                        onChange={(e) => setSitemapText(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background p-3 text-[10px] font-mono focus:outline-none resize-none"
                      />
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center justify-between">
                        <span>robots.txt</span>
                        <Save className="h-3.5 w-3.5 text-brand-magenta cursor-pointer" onClick={() => toast.success("Robots.txt rules updated!")} />
                      </div>
                      <textarea
                        rows={4}
                        value={robotsText}
                        onChange={(e) => setRobotsText(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background p-3 text-[10px] font-mono focus:outline-none resize-none"
                      />
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* 7. SETTINGS CONFIGURATION TAB */}
            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="font-display text-2xl font-bold tracking-tight">Configuration Settings</h1>
                  <p className="text-xs text-muted-foreground mt-1">
                    Manage corporate branding assets, contact handles, and website legal structures.
                  </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  
                  {/* Branding accents panel */}
                  <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Color Palette Accents</h3>
                    <div className="space-y-3">
                      <p className="text-[10px] text-muted-foreground leading-normal">
                        Select the design highlights applied to the admin console and corporate assets:
                      </p>

                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "magenta", label: "Brand Magenta", color: "bg-brand-magenta" },
                          { id: "pink", label: "Deep Pink", color: "bg-brand-pink" },
                          { id: "cyan", label: "Cool Cyan", color: "bg-brand-cyan" },
                        ].map((theme) => (
                          <button
                            key={theme.id}
                            onClick={() => setThemeAccent(theme.id)}
                            className={`flex items-center gap-2 rounded-xl border p-3 text-xs font-bold transition ${
                              themeAccent === theme.id ? "border-brand-magenta bg-white/5" : "border-white/5"
                            }`}
                          >
                            <span className={`h-3.5 w-3.5 rounded-full ${theme.color}`} />
                            {theme.label}
                          </button>
                        ))}
                      </div>

                      <div className="border-t border-white/5 pt-4 mt-2">
                        <label className="block text-[10px] text-muted-foreground mb-1 uppercase font-semibold">Favicon Upload Mock</label>
                        <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl p-3">
                          <ImageIcon className="h-5 w-5 text-brand-magenta" />
                          <div className="text-[10px] flex-1">
                            <p className="font-semibold">clicktake_favicon.png</p>
                            <span className="text-[8px] text-muted-foreground">32x32px • Transparent PNG</span>
                          </div>
                          <button
                            onClick={() => toast.success("Uploaded favicon")}
                            className="rounded-lg bg-white/10 px-2 py-1 text-[9px] hover:bg-white/20"
                          >
                            Swap
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact configurations */}
                  <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Contact Information Management</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] text-muted-foreground mb-1 uppercase font-semibold">Corporate Email Address</label>
                        <input
                          type="email"
                          value={contactConfig.email}
                          onChange={(e) => setContactConfig({ ...contactConfig, email: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-muted-foreground mb-1 uppercase font-semibold">Contact Phone number</label>
                        <input
                          type="text"
                          value={contactConfig.phone}
                          onChange={(e) => setContactConfig({ ...contactConfig, phone: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-muted-foreground mb-1 uppercase font-semibold">HQ Address Location</label>
                        <textarea
                          rows={2}
                          value={contactConfig.address}
                          onChange={(e) => setContactConfig({ ...contactConfig, address: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none resize-none"
                        />
                      </div>
                      <button
                        onClick={() => toast.success("Contact settings committed to API endpoints")}
                        className="w-full rounded-xl bg-brand-magenta text-white py-2 text-xs font-bold"
                      >
                        Update Contact Profile
                      </button>
                    </div>
                  </div>

                  {/* Social Handles */}
                  <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Social Media Profile Anchors</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] text-muted-foreground mb-1 uppercase font-semibold">LinkedIn Profile</label>
                          <input
                            type="text"
                            value={socialLinks.linkedin}
                            onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-muted-foreground mb-1 uppercase font-semibold">X (Twitter) handle</label>
                          <input
                            type="text"
                            value={socialLinks.x}
                            onChange={(e) => setSocialLinks({ ...socialLinks, x: e.target.value })}
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-muted-foreground mb-1 uppercase font-semibold">GitHub Organization</label>
                          <input
                            type="text"
                            value={socialLinks.github}
                            onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toast.success("Social anchors synchronized")}
                      className="w-full rounded-xl bg-brand-blue text-white py-2 mt-4 text-xs font-bold"
                    >
                      Save Social Anchors
                    </button>
                  </div>

                </div>
              </motion.div>
            )}

            {/* 8. SECURITY & LOGS TAB */}
            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="font-display text-2xl font-bold tracking-tight">Security & Infrastructure</h1>
                  <p className="text-xs text-muted-foreground mt-1">
                    Rebuild data, monitor rate limit firewalls, and check user authentication audits.
                  </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  
                  {/* Left columns: backups & Rate limiter */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* Backups List */}
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl">
                      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">System Backup Vault</h3>
                          <div className="text-[10px] text-muted-foreground">Snapshot configurations and database rollbacks</div>
                        </div>
                        <button
                          onClick={handleCreateBackup}
                          className="flex items-center gap-1 rounded-xl bg-brand-magenta text-white px-3 py-1.5 text-[10px] font-bold shadow-md"
                        >
                          <RefreshCw className="h-3 w-3" /> Snapshot Now
                        </button>
                      </div>

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
                                onClick={() => { setBackups(backups.filter((b) => b.id !== bk.id)); toast.error("Backup cleared"); }}
                                className="text-muted-foreground hover:text-rose-400 p-1"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Rate Limiting slider */}
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
                            onChange={(e) => setRateLimit(Number(e.target.value))}
                            className="w-full accent-brand-magenta"
                          />
                        </div>

                        <div className="border-t border-white/5 pt-4">
                          <label className="block text-[10px] text-muted-foreground mb-2 uppercase font-semibold">Active Firewall IP Blocks</label>
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
                                    onClick={() => { setBlockedIPs(blockedIPs.filter((i) => i.ip !== ipObj.ip)); toast.success(`IP ${ipObj.ip} unblocked`); }}
                                    className="text-[9px] font-bold text-brand-cyan hover:underline"
                                  >
                                    Unblock
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Right column: 2FA & logs */}
                  <div className="space-y-6">
                    
                    {/* Two-factor setup */}
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Two-Factor Authentication</h3>
                        <Lock className="h-4 w-4 text-brand-magenta" />
                      </div>

                      {twoFactorEnabled ? (
                        <div className="text-center py-4">
                          <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-2 animate-bounce" />
                          <p className="text-xs font-bold">2FA Protection Active</p>
                          <p className="text-[10px] text-muted-foreground mt-1">Accounts logins require timed OTP key codes.</p>
                          <button
                            onClick={() => { setTwoFactorEnabled(false); toast.error("2FA disabled"); }}
                            className="mt-4 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold"
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
                            {/* Mock QR */}
                            <div className="h-full w-full bg-slate-900 flex items-center justify-center text-[10px] text-white font-mono text-center leading-tight">
                              [ QR Mock ]<br/>Scan Me
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] text-muted-foreground mb-1 uppercase font-semibold text-center">Verify 6-digit key</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Type 123456 to test..."
                                value={otpInput}
                                onChange={(e) => setOtpInput(e.target.value)}
                                className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-center focus:outline-none font-mono"
                              />
                              <button
                                onClick={handleVerify2FA}
                                className="rounded-lg bg-brand-magenta text-white px-3 text-xs font-bold"
                              >
                                {isOtpVerifying ? "..." : "Verify"}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Audit Logs */}
                    <div className="rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Audits Checklist</h3>
                      <div className="space-y-2">
                        {[
                          { rule: "SMTP TLS Check", status: "Active" },
                          { rule: "Node API Protection", status: "Protected" },
                          { rule: "2FA Enforcement", status: "Optional" }
                        ].map((rules, idx) => (
                          <div key={idx} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-[10px]">
                            <span className="font-semibold">{rules.rule}</span>
                            <span className="font-mono text-emerald-400 font-bold">{rules.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </main>
      </div>
    </div>
  );
}

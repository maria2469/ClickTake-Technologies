import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save, Sparkles, Plus, Trash2, HelpCircle, Loader2, Upload, FolderTree,
  Brain, Bot, Wand2, Eye, Server, Layers, Shield, Cloud,
  Search, PenTool, Megaphone, TrendingUp, Palette, Video, Rocket,
  Globe, Code2, Award, BarChart3, Clock, ShieldCheck, Compass, FileSearch, Users,
  Zap, Cpu, Database, GitBranch, Smartphone,
} from "lucide-react";

const ICON_OPTIONS = [
  { value: "Sparkles", label: "Sparkles", Icon: Sparkles },
  { value: "Brain", label: "Brain", Icon: Brain },
  { value: "Bot", label: "Bot", Icon: Bot },
  { value: "Wand2", label: "Wand2", Icon: Wand2 },
  { value: "Eye", label: "Eye", Icon: Eye },
  { value: "Server", label: "Server", Icon: Server },
  { value: "Layers", label: "Layers", Icon: Layers },
  { value: "Shield", label: "Shield", Icon: Shield },
  { value: "Cloud", label: "Cloud", Icon: Cloud },
  { value: "Search", label: "Search", Icon: Search },
  { value: "PenTool", label: "PenTool", Icon: PenTool },
  { value: "Megaphone", label: "Megaphone", Icon: Megaphone },
  { value: "TrendingUp", label: "TrendingUp", Icon: TrendingUp },
  { value: "Palette", label: "Palette", Icon: Palette },
  { value: "Video", label: "Video", Icon: Video },
  { value: "Rocket", label: "Rocket", Icon: Rocket },
  { value: "Globe", label: "Globe", Icon: Globe },
  { value: "Code2", label: "Code2", Icon: Code2 },
  { value: "Award", label: "Award", Icon: Award },
  { value: "BarChart3", label: "BarChart3", Icon: BarChart3 },
  { value: "Clock", label: "Clock", Icon: Clock },
  { value: "ShieldCheck", label: "ShieldCheck", Icon: ShieldCheck },
  { value: "Compass", label: "Compass", Icon: Compass },
  { value: "FileSearch", label: "FileSearch", Icon: FileSearch },
  { value: "Users", label: "Users", Icon: Users },
  { value: "Zap", label: "Zap", Icon: Zap },
  { value: "Cpu", label: "Cpu", Icon: Cpu },
  { value: "Database", label: "Database", Icon: Database },
  { value: "GitBranch", label: "GitBranch", Icon: GitBranch },
  { value: "Smartphone", label: "Smartphone", Icon: Smartphone },
];
import { toast } from "sonner";
import { logAudit } from "@/lib/logAudit";
import { servicesService, type ServiceItem, type ProcessStep, type PricingPackage } from "@/lib/servicesService";

export const Route = createFileRoute("/admin/services")({
  head: () => ({
    meta: [
      { title: "Services & Packages — ClickTake Admin Portal" },
      { name: "description", content: "Dynamically manage service categories, offerings, capabilities, process timelines, and pricing tiers." },
    ],
  }),
  component: AdminServices,
});

function IconSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const selected = ICON_OPTIONS.find(o => o.value === value) || ICON_OPTIONS[0];
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? ICON_OPTIONS.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    : ICON_OPTIONS;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm hover:border-primary/40 transition-colors"
      >
        <selected.Icon className="h-4 w-4 shrink-0 text-foreground" />
        <span className="flex-1 text-left">{selected.label}</span>
        <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setSearch(""); }} />
          <div className="absolute top-full left-0 mt-1 w-full max-h-64 z-50 bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
            <div className="p-2 border-b border-border">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search icons…"
                className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-xs outline-none"
                autoFocus
              />
            </div>
            <div className="overflow-y-auto max-h-48 p-1 space-y-0.5">
              {filtered.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false); setSearch(""); }}
                  className={`flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm transition-colors ${opt.value === value ? "bg-primary/10 text-primary" : "hover:bg-secondary text-foreground"}`}
                >
                  <opt.Icon className="h-4 w-4 shrink-0" />
                  {opt.label}
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-4 text-xs text-muted-foreground">No icons found</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function AdminServices() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "capabilities" | "process" | "pricing">("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Edit states for selected service
  const [editGeneral, setEditGeneral] = useState<Partial<ServiceItem>>({});
  const [editCapabilities, setEditCapabilities] = useState<any[]>([]);
  const [editResults, setEditResults] = useState<any[]>([]);
  const [editDifferentiators, setEditDifferentiators] = useState<any[]>([]);
  const [editDeliverables, setEditDeliverables] = useState<any[]>([]);

  // Processes & Packages states
  const [processes, setProcesses] = useState<ProcessStep[]>([]);
  const [packages, setPackages] = useState<PricingPackage[]>([]);

  // Add Service state
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [newServiceSlug, setNewServiceSlug] = useState("");
  const [newServiceTitle, setNewServiceTitle] = useState("");
  const [newServiceCategory, setNewServiceCategory] = useState("web");
  const [newServiceCatLabel, setNewServiceCatLabel] = useState("Web Development");

  // Category Management state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [catKey, setCatKey] = useState("");
  const [catLabel, setCatLabel] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catIcon, setCatIcon] = useState("Sparkles");
  const [catGradient, setCatGradient] = useState("from-brand-cyan to-brand-blue");

  // Image upload state
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (selectedServiceId) {
      const selected = services.find(s => s.id === selectedServiceId);
      if (selected) {
        setEditGeneral({
          slug: selected.slug || '',
          category: selected.category || '',
          category_label: selected.category_label || '',
          title: selected.title || '',
          eyebrow: selected.eyebrow || '',
          description: selected.description || '',
          detailed_description: selected.detailed_description || '',
          gradient: selected.gradient || 'from-brand-cyan via-brand-blue to-brand-magenta',
          glow: selected.glow || 'rgba(6,182,212,0.15)',
          icon_name: selected.icon_name || 'Sparkles',
          image_url: selected.image_url || '',
          display_order: selected.display_order ?? 0
        });
        setEditCapabilities(Array.isArray(selected.items) ? selected.items : []);
        setEditResults(Array.isArray(selected.results) ? selected.results : []);
        setEditDifferentiators(Array.isArray(selected.differentiators) ? selected.differentiators : []);
        setEditDeliverables(Array.isArray(selected.deliverables) ? selected.deliverables : []);

        fetchProcessesAndPackages(selected.id);
      }
    }
  }, [selectedServiceId, services]);


  const fetchAll = async () => {
    setLoading(true);
    try {
      const [svcData, catData] = await Promise.all([
        servicesService.getAll(),
        servicesService.getCategories()
      ]);
      setServices(svcData);
      setCategories(catData);
      if (svcData.length > 0 && !selectedServiceId) {
        setSelectedServiceId(svcData[0].id);
      }
    } catch (e: any) {
      toast.error("Failed to load services: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProcessesAndPackages = async (serviceId: string) => {
    try {
      const [procData, pkgData] = await Promise.all([
        servicesService.getProcesses(serviceId),
        servicesService.getPackages(serviceId)
      ]);
      setProcesses(procData);
      setPackages(pkgData);
    } catch (e: any) {
      toast.error("Error loading processes/packages: " + e.message);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`,
        { method: 'POST', body: formData }
      );
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setEditGeneral({ ...editGeneral, image_url: data.secure_url });
      toast.success("Image uploaded successfully");
    } catch (e: any) {
      toast.error("Image upload failed: " + e.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveAll = async () => {
    if (!selectedServiceId) return;
    setSaving(true);

    try {
      const updatedPayload = {
        ...editGeneral,
        items: editCapabilities,
        results: editResults,
        differentiators: editDifferentiators,
        deliverables: editDeliverables,
      };

      await servicesService.update(selectedServiceId, updatedPayload);
      await servicesService.replaceProcesses(selectedServiceId, processes);
      await servicesService.replacePackages(selectedServiceId, packages);

      setServices(services.map(s => s.id === selectedServiceId ? { ...s, ...updatedPayload } as ServiceItem : s));
      await logAudit(`Updated service details for '${editGeneral.title}'`, 'cms', selectedServiceId);
      toast.success("Service changes saved successfully!");
      fetchProcessesAndPackages(selectedServiceId);
    } catch (e: any) {
      toast.error("Failed to save changes: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceSlug.trim() || !newServiceTitle.trim()) return;

    try {
      const payload = {
        slug: newServiceSlug.trim(),
        title: newServiceTitle.trim(),
        category: newServiceCategory,
        category_label: newServiceCatLabel,
        gradient: "from-brand-cyan via-brand-blue to-brand-magenta",
        glow: "rgba(6,182,212,0.15)",
        eyebrow: newServiceCatLabel,
        description: "New custom service offering managed from the admin panel.",
        detailed_description: "New custom service offering ready for client engagements.",
        icon_name: "Sparkles",
        image_url: "",
        items: [],
        results: [],
        differentiators: [],
        deliverables: [],
        display_order: services.length + 1
      };

      const created = await servicesService.create(payload);
      toast.success(`Service '${newServiceTitle}' created successfully!`);
      setIsAddServiceOpen(false);
      setNewServiceSlug("");
      setNewServiceTitle("");
      setServices([...services, created]);
      setSelectedServiceId(created.id);
    } catch (e: any) {
      toast.error("Failed to create service: " + e.message);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this service and all of its processes/packages?")) return;
    try {
      await servicesService.delete(serviceId);
      toast.success("Service deleted successfully.");
      setServices(services.filter(s => s.id !== serviceId));
      if (selectedServiceId === serviceId) {
        setSelectedServiceId(services.find(s => s.id !== serviceId)?.id || null);
      }
    } catch (e: any) {
      toast.error("Delete failed: " + e.message);
    }
  };

  // Category Management
  const openCategoryModal = (cat?: any) => {
    if (cat) {
      setEditingCategory(cat);
      setCatKey(cat.key);
      setCatLabel(cat.label);
      setCatDesc(cat.description || "");
      setCatIcon(cat.icon_name || "Sparkles");
      setCatGradient(cat.gradient || "from-brand-cyan to-brand-blue");
    } else {
      setEditingCategory(null);
      setCatKey("");
      setCatLabel("");
      setCatDesc("");
      setCatIcon("Sparkles");
      setCatGradient("from-brand-cyan to-brand-blue");
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await servicesService.updateCategory(editingCategory.id, { key: catKey, label: catLabel, display_order: editingCategory.display_order });
      } else {
        await servicesService.createCategory({ key: catKey, label: catLabel, display_order: categories.length + 1 });
      }
      toast.success(`Category ${editingCategory ? 'updated' : 'created'} successfully`);
      setIsCategoryModalOpen(false);
      const freshCats = await servicesService.getCategories();
      setCategories(freshCats);
    } catch (e: any) {
      toast.error("Category save failed: " + e.message);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("Delete this category? Services using it won't be removed.")) return;
    try {
      await servicesService.deleteCategory(id);
      toast.success("Category deleted");
      setCategories(categories.filter(c => c.id !== id));
    } catch (e: any) {
      toast.error("Delete failed: " + e.message);
    }
  };

  // Helper functions for array states
  const addCapability = () => {
    setEditCapabilities([...editCapabilities, { title: "New Capability", icon_name: "Sparkles", desc: "", features: [] }]);
  };

  const updateCapability = (index: number, key: string, val: any) => {
    const updated = [...editCapabilities];
    updated[index] = { ...updated[index], [key]: val };
    setEditCapabilities(updated);
  };

  const removeCapability = (index: number) => {
    setEditCapabilities(editCapabilities.filter((_, i) => i !== index));
  };

  const addProcessStep = () => {
    setProcesses([...processes, { service_id: selectedServiceId!, step_number: processes.length + 1, title: "New Step", description: "" }]);
  };

  const updateProcessStep = (index: number, key: string, val: any) => {
    const updated = [...processes];
    updated[index] = { ...updated[index], [key]: val };
    setProcesses(updated);
  };

  const removeProcessStep = (index: number) => {
    setProcesses(processes.filter((_, i) => i !== index));
  };

  const addPackage = (level: "Basic" | "Standard" | "Premium") => {
    if (packages.some(p => p.package_level === level)) return;
    setPackages([...packages, { service_id: selectedServiceId!, package_level: level, price: "£0", delivery_days: "7 days", description: "", features: [] }]);
  };

  const updatePackage = (level: "Basic" | "Standard" | "Premium", key: string, val: any) => {
    setPackages(packages.map(p => p.package_level === level ? { ...p, [key]: val } : p));
  };

  const removePackage = (level: string) => {
    setPackages(packages.filter(p => p.package_level !== level));
  };

  const activeService = services.find(s => s.id === selectedServiceId) || null;

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card border border-border p-6 rounded-2xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services & Packages</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage dynamic service categories, detailed capabilities, processes, and basic/standard/premium pricing packages.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => openCategoryModal()}
            className="flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 font-semibold text-muted-foreground hover:bg-secondary transition-colors"
          >
            <FolderTree className="h-4 w-4" /> Categories
          </button>
          <button
            onClick={() => setIsAddServiceOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue px-5 py-2.5 font-semibold text-white shadow-lg hover:scale-[1.02] active:scale-95 transition-transform"
          >
            <Plus className="h-4 w-4" /> Create Service
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT LIST PANEL */}
          <div className="lg:col-span-4 bg-card border border-border rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-280px)]">
            <div className="p-4 border-b border-border bg-card/60">
              <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Services Index</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {services.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedServiceId(s.id)}
                  className={`flex justify-between items-center p-3 rounded-xl cursor-pointer border transition-all ${selectedServiceId === s.id
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-transparent bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${s.gradient || "from-brand-cyan to-brand-blue"} flex items-center justify-center text-white text-xs font-bold`}>
                      {(s.slug || '??').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground">{(s.title || s.slug || 'Untitled').split('.')[0]}</div>
                      <div className="text-[10px] opacity-75">{s.category_label || s.category || '—'} · /{s.slug}</div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteService(s.id);
                    }}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT CONFIG WORKSPACE */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {activeService ? (
              <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
                {/* TABS HEADER */}
                <div className="flex border-b border-border bg-card/40 p-2 overflow-x-auto gap-1">
                  {(["general", "capabilities", "process", "pricing"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg capitalize transition-all ${activeTab === tab
                          ? "bg-primary text-primary-foreground shadow"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        }`}
                    >
                      {tab === "general" ? "General Details" : tab === "process" ? "Process timeline" : tab}
                    </button>
                  ))}
                </div>

                <div className="p-6 space-y-6 flex-1 overflow-y-auto max-h-[600px]">
                  {/* TAB 1: GENERAL DETAILS */}
                  {activeTab === "general" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-muted-foreground uppercase">Service Slug</label>
                          <input
                            type="text"
                            value={editGeneral.slug || ""}
                            onChange={(e) => setEditGeneral({ ...editGeneral, slug: e.target.value })}
                            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
                            placeholder="e.g. web/saas"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-muted-foreground uppercase">Service Title</label>
                          <input
                            type="text"
                            value={editGeneral.title || ""}
                            onChange={(e) => setEditGeneral({ ...editGeneral, title: e.target.value })}
                            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
                            placeholder="Get found by clients ready to buy."
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-muted-foreground uppercase">Category Key</label>
                          <select
                            value={editGeneral.category || ""}
                            onChange={(e) => setEditGeneral({ ...editGeneral, category: e.target.value })}
                            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
                          >
                            {categories.map(c => (
                              <option key={c.id} value={c.key}>{c.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-muted-foreground uppercase">Category Label</label>
                          <input
                            type="text"
                            value={editGeneral.category_label || ""}
                            onChange={(e) => setEditGeneral({ ...editGeneral, category_label: e.target.value })}
                            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
                            placeholder="e.g. Full Stack Web"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase">Card Eyebrow</label>
                        <input
                          type="text"
                          value={editGeneral.eyebrow || ""}
                          onChange={(e) => setEditGeneral({ ...editGeneral, eyebrow: e.target.value })}
                          className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase">Short Description (for cards)</label>
                        <textarea
                          rows={2}
                          value={editGeneral.description || ""}
                          onChange={(e) => setEditGeneral({ ...editGeneral, description: e.target.value })}
                          className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase">Detailed Description (for hero section)</label>
                        <textarea
                          rows={3}
                          value={editGeneral.detailed_description || ""}
                          onChange={(e) => setEditGeneral({ ...editGeneral, detailed_description: e.target.value })}
                          className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-muted-foreground uppercase">Icon</label>
                          <IconSelect
                            value={editGeneral.icon_name || "Sparkles"}
                            onChange={(v) => setEditGeneral({ ...editGeneral, icon_name: v })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-muted-foreground uppercase">Color Gradient Classes</label>
                          <input
                            type="text"
                            value={editGeneral.gradient || ""}
                            onChange={(e) => setEditGeneral({ ...editGeneral, gradient: e.target.value })}
                            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
                            placeholder="from-brand-cyan to-brand-blue"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-muted-foreground uppercase">Display Order</label>
                          <input
                            type="number"
                            value={editGeneral.display_order ?? 0}
                            onChange={(e) => setEditGeneral({ ...editGeneral, display_order: parseInt(e.target.value) })}
                            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-muted-foreground uppercase">Glow CSS Value</label>
                          <input
                            type="text"
                            value={editGeneral.glow || ""}
                            onChange={(e) => setEditGeneral({ ...editGeneral, glow: e.target.value })}
                            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
                            placeholder="rgba(6,182,212,0.15)"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase">Service Image</label>
                        {editGeneral.image_url ? (
                          <div className="relative rounded-xl overflow-hidden border border-border max-w-xs">
                            <img src={editGeneral.image_url} alt="Service" className="w-full h-32 object-cover" />
                            <button
                              onClick={() => setEditGeneral({ ...editGeneral, image_url: "" })}
                              className="absolute top-2 right-2 bg-destructive/90 text-white p-1 rounded-lg text-xs"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:border-primary transition-colors max-w-xs">
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            {uploadingImage ? (
                              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            ) : (
                              <>
                                <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                                <span className="text-xs text-muted-foreground">Click to upload image</span>
                              </>
                            )}
                          </label>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: CAPABILITIES */}
                  {activeTab === "capabilities" && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-base text-foreground">Specific Capabilities / Features</h3>
                        <button
                          onClick={addCapability}
                          className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover bg-primary/10 px-3 py-1.5 rounded-lg"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Capability
                        </button>
                      </div>

                      <div className="space-y-4">
                        {editCapabilities.map((cap, idx) => (
                          <div key={idx} className="bg-secondary/40 border border-border p-4 rounded-xl space-y-3 relative">
                            <button
                              onClick={() => removeCapability(idx)}
                              className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase">Title</label>
                                <input
                                  type="text"
                                  value={cap.title || ""}
                                  onChange={(e) => updateCapability(idx, "title", e.target.value)}
                                  className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm font-semibold"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase">Icon</label>
                                <IconSelect
                                  value={cap.icon_name || "Sparkles"}
                                  onChange={(v) => updateCapability(idx, "icon_name", v)}
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase">Description</label>
                              <textarea
                                rows={2}
                                value={cap.desc || ""}
                                onChange={(e) => updateCapability(idx, "desc", e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase">Features Checklist (comma-separated)</label>
                              <input
                                type="text"
                                value={Array.isArray(cap.features) ? cap.features.join(", ") : (cap.features || "")}
                                onChange={(e) => updateCapability(idx, "features", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))}
                                className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm"
                                placeholder="Audit logs, RLS rules, JWT verification"
                              />
                            </div>
                          </div>
                        ))}

                        {editCapabilities.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground text-sm">
                            No capabilities configured for this service.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: PROCESS TIMELINE */}
                  {activeTab === "process" && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-base text-foreground">Delivery Process Steps</h3>
                        <button
                          onClick={addProcessStep}
                          className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover bg-primary/10 px-3 py-1.5 rounded-lg"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Step
                        </button>
                      </div>

                      <div className="space-y-4">
                        {processes.map((step, idx) => (
                          <div key={idx} className="bg-secondary/40 border border-border p-4 rounded-xl flex gap-4 relative">
                            <div className="flex flex-col items-center justify-center bg-primary/10 text-primary font-bold h-10 w-10 rounded-full shrink-0">
                              {idx + 1}
                            </div>
                            <div className="flex-1 space-y-3 pr-8">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase">Step Title</label>
                                <input
                                  type="text"
                                  value={step.title || ""}
                                  onChange={(e) => updateProcessStep(idx, "title", e.target.value)}
                                  className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm font-semibold"
                                  placeholder="e.g. Scoping & Architecture"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase">Step Description</label>
                                <textarea
                                  rows={2}
                                  value={step.description || ""}
                                  onChange={(e) => updateProcessStep(idx, "description", e.target.value)}
                                  className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm"
                                  placeholder="What happens during this phase..."
                                />
                              </div>
                            </div>

                            <button
                              onClick={() => removeProcessStep(idx)}
                              className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}

                        {processes.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground text-sm">
                            No process timeline configured for this service.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: PRICING PACKAGES */}
                  {activeTab === "pricing" && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-base text-foreground">Pricing Tier Cards</h3>
                        <div className="flex gap-2">
                          {(["Basic", "Standard", "Premium"] as const).map((lvl) => (
                            <button
                              key={lvl}
                              disabled={packages.some(p => p.package_level === lvl)}
                              onClick={() => addPackage(lvl)}
                              className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1.5 rounded-lg disabled:opacity-40"
                            >
                              + {lvl}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(["Basic", "Standard", "Premium"] as const).map((lvl) => {
                          const pkg = packages.find(p => p.package_level === lvl);
                          if (!pkg) return null;

                          return (
                            <div key={lvl} className="bg-secondary/40 border border-border p-4 rounded-xl relative space-y-3">
                              <button
                                onClick={() => removePackage(lvl)}
                                className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>

                              <div className="text-sm font-bold text-primary">{lvl} Package</div>

                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Price</label>
                                  <input
                                    type="text"
                                    value={pkg.price || ""}
                                    onChange={(e) => updatePackage(lvl, "price", e.target.value)}
                                    className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs font-bold"
                                    placeholder="£1,499"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Delivery</label>
                                  <input
                                    type="text"
                                    value={pkg.delivery_days || ""}
                                    onChange={(e) => updatePackage(lvl, "delivery_days", e.target.value)}
                                    className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs"
                                    placeholder="14 days"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase">Short Description</label>
                                <textarea
                                  rows={2}
                                  value={pkg.description || ""}
                                  onChange={(e) => updatePackage(lvl, "description", e.target.value)}
                                  className="w-full bg-background border border-border rounded-lg px-2.5 py-1 text-xs"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase">Features (one per line)</label>
                                <textarea
                                  rows={4}
                                  value={Array.isArray(pkg.features) ? pkg.features.join("\n") : (pkg.features || "")}
                                  onChange={(e) => updatePackage(lvl, "features", e.target.value.split("\n").map(s => s.trim()).filter(Boolean))}
                                  className="w-full bg-background border border-border rounded-lg px-2.5 py-1 text-xs font-mono"
                                  placeholder="Feature A&#10;Feature B&#10;Feature C"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {packages.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                          No pricing tiers defined yet. Click Basic/Standard/Premium buttons above to configure them.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* WORKSPACE SAVE CONTROL */}
                <div className="border-t border-border bg-card/60 p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <HelpCircle className="h-4 w-4" />
                    Admins can manage capabilities & process stages in the tabs above.
                  </div>
                  <button
                    onClick={handleSaveAll}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue px-6 py-2.5 font-semibold text-white shadow-lg disabled:opacity-40 hover:scale-[1.02] active:scale-95 transition-transform"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border p-12 rounded-2xl text-center text-muted-foreground">
                <Sparkles className="mx-auto h-8 w-8 opacity-40 mb-3" />
                Select a service from the index to start configuring its dynamic elements.
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE NEW SERVICE MODAL */}
      <AnimatePresence>
        {isAddServiceOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-card border border-border rounded-2xl overflow-hidden shadow-2xl"
            >
              <form onSubmit={handleAddService}>
                <div className="p-6 border-b border-border bg-card/60 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-brand-cyan" /> Create Custom Service
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAddServiceOpen(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Close
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Service Slug (must be unique)</label>
                    <input
                      type="text"
                      required
                      value={newServiceSlug}
                      onChange={(e) => setNewServiceSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-/]/g, ''))}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
                      placeholder="e.g. mobile/ios-development"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Service Display Title</label>
                    <input
                      type="text"
                      required
                      value={newServiceTitle}
                      onChange={(e) => setNewServiceTitle(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
                      placeholder="e.g. Build native iOS experiences."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Category</label>
                      <select
                        value={newServiceCategory}
                        onChange={(e) => {
                          setNewServiceCategory(e.target.value);
                          const match = categories.find(c => c.key === e.target.value);
                          setNewServiceCatLabel(match?.label || "Custom Category");
                        }}
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.key}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Category Label</label>
                      <input
                        type="text"
                        value={newServiceCatLabel}
                        onChange={(e) => setNewServiceCatLabel(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-border bg-card/60 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddServiceOpen(false)}
                    className="px-4 py-2 text-sm font-semibold rounded-xl border border-border hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue font-semibold text-white shadow-lg hover:scale-102 active:scale-95 transition-transform"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── CATEGORY MANAGEMENT MODAL ── */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-card border border-border rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-border bg-card/60 flex justify-between items-center">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <FolderTree className="h-5 w-5 text-brand-cyan" /> Manage Categories
                </h3>
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Close
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Existing categories list */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Existing Categories</h4>
                  {categories.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">No categories defined yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {categories.map(cat => (
                        <div key={cat.id} className="flex items-center justify-between bg-secondary/40 border border-border p-3 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${cat.gradient || 'from-brand-cyan to-brand-blue'} flex items-center justify-center text-white text-xs font-bold`}>
                              {cat.key.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-semibold">{cat.label}</div>
                              <div className="text-[10px] text-muted-foreground">/{cat.key}</div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => openCategoryModal(cat)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add / Edit form */}
                <form onSubmit={handleSaveCategory} className="space-y-4 border-t border-border pt-6">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Key (slug)</label>
                      <input
                        type="text"
                        required
                        value={catKey}
                        onChange={(e) => setCatKey(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
                        placeholder="e.g. mobile"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Label</label>
                      <input
                        type="text"
                        required
                        value={catLabel}
                        onChange={(e) => setCatLabel(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
                        placeholder="e.g. Mobile Development"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Icon</label>
                      <IconSelect
                        value={catIcon}
                        onChange={(v) => setCatIcon(v)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Gradient</label>
                      <input
                        type="text"
                        value={catGradient}
                        onChange={(e) => setCatGradient(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => { setEditingCategory(null); setCatKey(""); setCatLabel(""); setCatDesc(""); setCatIcon("Sparkles"); setCatGradient("from-brand-cyan to-brand-blue"); }}
                      className="px-4 py-2 text-sm font-semibold rounded-xl border border-border hover:bg-secondary transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
                    >
                      {editingCategory ? 'Update' : 'Create'} Category
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


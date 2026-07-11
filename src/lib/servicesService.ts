import { supabase } from './supabaseClient'

export interface ServiceItem {
  id: string
  slug: string
  category: string
  category_label: string
  title: string
  gradient: string
  glow: string
  eyebrow: string
  description: string
  detailed_description: string
  icon_name: string
  image_url: string
  items: any[]
  results: any[]
  differentiators: any[]
  deliverables: any[]
  display_order: number
  created_at: string
  updated_at: string
}

export interface ProcessStep {
  id?: string
  service_id: string
  step_number: number
  title: string
  description: string
}

export interface PricingPackage {
  id?: string
  service_id: string
  package_level: "Basic" | "Standard" | "Premium"
  price: string
  delivery_days: string
  description: string
  features: string[]
}

export const servicesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('display_order')
    if (error) throw error
    return data as ServiceItem[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data as ServiceItem
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('slug', slug)
      .single()
    if (error) throw error
    return data as ServiceItem
  },

  async create(payload: Partial<ServiceItem>) {
    const { data, error } = await supabase
      .from('services')
      .insert([payload])
      .select()
    if (error) throw error
    return data?.[0] as ServiceItem
  },

  async update(id: string, payload: Partial<ServiceItem>) {
    const { error } = await supabase
      .from('services')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  async getProcesses(serviceId: string) {
    const { data, error } = await supabase
      .from('service_processes')
      .select('*')
      .eq('service_id', serviceId)
      .order('step_number')
    if (error) throw error
    return (data || []) as ProcessStep[]
  },

  async replaceProcesses(serviceId: string, processes: Omit<ProcessStep, 'id' | 'service_id'>[]) {
    await supabase.from('service_processes').delete().eq('service_id', serviceId)
    if (processes.length > 0) {
      const insertData = processes.map((p, idx) => ({
        service_id: serviceId,
        step_number: idx + 1,
        title: p.title,
        description: p.description,
      }))
      const { error } = await supabase.from('service_processes').insert(insertData)
      if (error) throw error
    }
  },

  async getPackages(serviceId: string) {
    const { data, error } = await supabase
      .from('pricing_packages')
      .select('*')
      .eq('service_id', serviceId)
    if (error) throw error
    return (data || []) as PricingPackage[]
  },

  async replacePackages(serviceId: string, packages: Omit<PricingPackage, 'id' | 'service_id'>[]) {
    await supabase.from('pricing_packages').delete().eq('service_id', serviceId)
    if (packages.length > 0) {
      const insertData = packages.map(p => ({
        service_id: serviceId,
        package_level: p.package_level,
        price: p.price,
        delivery_days: p.delivery_days,
        description: p.description,
        features: p.features,
      }))
      const { error } = await supabase.from('pricing_packages').insert(insertData)
      if (error) throw error
    }
  },

  async getCategories() {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('display_order')
    if (error) throw error
    return data || []
  },

  async createCategory(payload: { key: string; label: string; display_order?: number }) {
    const { data, error } = await supabase
      .from('service_categories')
      .insert([payload])
      .select()
    if (error) throw error
    return data?.[0]
  },

  async updateCategory(id: string, payload: Partial<{ key: string; label: string; display_order: number }>) {
    const { error } = await supabase
      .from('service_categories')
      .update(payload)
      .eq('id', id)
    if (error) throw error
  },

  async deleteCategory(id: string) {
    const { error } = await supabase
      .from('service_categories')
      .delete()
      .eq('id', id)
    if (error) throw error
  },
}

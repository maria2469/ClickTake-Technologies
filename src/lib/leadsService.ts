import { supabase } from './supabaseClient'

export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  service_interest?: string
  message?: string
  status: string
  source_page?: string
  internal_notes?: string
  source?: string
  created_at: string
}

export const leadsService = {
  async getLeads(filters?: {
    status?: string
    search?: string
    from?: string
    to?: string
  }) {
    let query = supabase
      .from('leads')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }
    if (filters?.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`
      )
    }
    if (filters?.from) {
      query = query.gte('created_at', filters.from)
    }
    if (filters?.to) {
      query = query.lte('created_at', filters.to)
    }

    const { data, error } = await query
    if (error) throw error
    return data as Lead[]
  },

  async getLead(id: string) {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data as Lead
  },

  async updateLeadStatus(id: string, status: string) {
    const { error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id)
    if (error) throw error
  },

  async updateInternalNotes(id: string, internal_notes: string) {
    const { error } = await supabase
      .from('leads')
      .update({ internal_notes })
      .eq('id', id)
    if (error) throw error
  },

  async deleteLead(id: string) {
    const { error } = await supabase
      .from('leads')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  },

  async exportCSV() {
    const { data, error } = await supabase
      .from('leads')
      .select('name,email,phone,service_interest,message,status,source_page,created_at')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    if (error) throw error

    const headers = ['Name', 'Email', 'Phone', 'Service', 'Message', 'Status', 'Source Page', 'Date']
    const rows = (data as Lead[]).map(l => [
      l.name, l.email, l.phone ?? '', l.service_interest ?? '',
      l.message ?? '', l.status, l.source_page ?? '',
      new Date(l.created_at).toLocaleDateString()
    ])

    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }
}
import { supabase } from './supabaseClient'

export const analyticsService = {
  async getDashboardStats() {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)

    const [
      { count: leadsToday },
      { count: leadsMonth },
      { count: pageViewsToday },
      { data: recentLeads },
      { data: leadsByStatus },
    ] = await Promise.all([
      supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayStart.toISOString())
        .is('deleted_at', null),

      supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart.toISOString())
        .is('deleted_at', null),

      supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .gte('visited_at', todayStart.toISOString()),

      supabase
        .from('leads')
        .select('id,name,email,service_interest,status,created_at')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(5),

      supabase
        .from('leads')
        .select('status')
        .is('deleted_at', null),
    ])

    // Count leads by status
    const statusCounts: Record<string, number> = {}
    ;(leadsByStatus ?? []).forEach(({ status }) => {
      statusCounts[status] = (statusCounts[status] ?? 0) + 1
    })

    return {
      leadsToday: leadsToday ?? 0,
      leadsMonth: leadsMonth ?? 0,
      pageViewsToday: pageViewsToday ?? 0,
      recentLeads: recentLeads ?? [],
      leadsByStatus: statusCounts,
    }
  }
}
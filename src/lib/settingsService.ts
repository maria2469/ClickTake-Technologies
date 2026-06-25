import { supabase } from './supabaseClient'

export const settingsService = {
  async getSetting(key: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .single()
    if (error) return null
    return data?.value ?? null
  },

  async getAllSettings(): Promise<Record<string, string>> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('key,value')
    if (error) throw error
    return Object.fromEntries((data ?? []).map(r => [r.key, r.value ?? '']))
  },

  async updateSetting(key: string, value: string) {
    const { error } = await supabase
      .from('site_settings')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('key', key)
    if (error) throw error
  },

  async updateMultiple(settings: Record<string, string>) {
    const updates = Object.entries(settings).map(([key, value]) =>
      supabase
        .from('site_settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key)
    )
    await Promise.all(updates)
  }
}
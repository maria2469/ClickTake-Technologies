import { supabase } from './supabaseClient'

export interface Page {
  id: string
  slug: string
  title: string
  content?: any
  blocks?: any[]
  meta_title?: string
  meta_description?: string
  og_image_url?: string
  canonical_url?: string
  is_published: boolean
  updated_at: string
}

export const pagesService = {
  async getPages() {
    const { data, error } = await supabase
      .from('pages')
      .select('id,slug,title,is_published,updated_at')
      .order('updated_at', { ascending: false })
    if (error) throw error
    return data as Page[]
  },

  async getPage(id: string) {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data as Page
  },

  async getPageBySlug(slug: string) {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .single()
    if (error) throw error
    return data as Page
  },

  async createPage(payload: Partial<Page>) {
    const { data, error } = await supabase
      .from('pages')
      .insert(payload)
      .select()
      .single()
    if (error) throw error
    return data as Page
  },

  async updatePage(id: string, payload: Partial<Page>) {
    const { error } = await supabase
      .from('pages')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  },

  async deletePage(id: string) {
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  async togglePublish(id: string, is_published: boolean) {
    const { error } = await supabase
      .from('pages')
      .update({ is_published, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  },

  async duplicatePage(id: string) {
    const original = await pagesService.getPage(id)
    const { data, error } = await supabase
      .from('pages')
      .insert({
        ...original,
        id: undefined,
        slug: `${original.slug}-copy-${Date.now()}`,
        title: `${original.title} (Copy)`,
        is_published: false,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    if (error) throw error
    return data as Page
  }
}
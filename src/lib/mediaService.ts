import { supabase } from './supabaseClient'

export interface MediaItem {
  id: string
  name?: string
  file_name?: string
  url: string
  type?: string
  size?: string
  cloudinary_public_id?: string
  created_at: string
}

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string

export const mediaService = {
  async uploadToCloudinary(file: File): Promise<{ url: string; public_id: string }> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
      { method: 'POST', body: formData }
    )
    if (!res.ok) throw new Error('Cloudinary upload failed')
    const data = await res.json()
    return { url: data.secure_url, public_id: data.public_id }
  },

  async saveMediaRecord(payload: {
    file_name: string
    url: string
    cloudinary_public_id: string
    type: string
    size: string
  }) {
    const { data, error } = await supabase
      .from('cms_media')
      .insert({
        name: payload.file_name,
        file_name: payload.file_name,
        url: payload.url,
        cloudinary_public_id: payload.cloudinary_public_id,
        type: payload.type,
        size: payload.size,
      })
      .select()
      .single()
    if (error) throw error
    return data as MediaItem
  },

  async uploadAndSave(file: File): Promise<MediaItem> {
    const { url, public_id } = await mediaService.uploadToCloudinary(file)
    return await mediaService.saveMediaRecord({
      file_name: file.name,
      url,
      cloudinary_public_id: public_id,
      type: file.type,
      size: String(file.size),
    })
  },

  async getMediaLibrary() {
    const { data, error } = await supabase
      .from('cms_media')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data as MediaItem[]
  },

  async deleteMedia(id: string, cloudinary_public_id?: string) {
    // Delete from Supabase
    const { error } = await supabase
      .from('cms_media')
      .delete()
      .eq('id', id)
    if (error) throw error
    // Note: Cloudinary delete needs backend/signed request — handle later
  }
}
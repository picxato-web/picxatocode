export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          display_order: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          display_order?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          display_order?: number | null
          created_at?: string | null
        }
      }
      assets: {
        Row: {
          id: string
          title: string
          description: string | null
          category_id: string | null
          file_url: string
          thumbnail_url: string
          file_type: string | null
          file_size: number | null
          width: number | null
          height: number | null
          downloads_count: number | null
          views_count: number | null
          tags: string[] | null
          is_featured: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category_id?: string | null
          file_url: string
          thumbnail_url: string
          file_type?: string | null
          file_size?: number | null
          width?: number | null
          height?: number | null
          downloads_count?: number | null
          views_count?: number | null
          tags?: string[] | null
          is_featured?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category_id?: string | null
          file_url?: string
          thumbnail_url?: string
          file_type?: string | null
          file_size?: number | null
          width?: number | null
          height?: number | null
          downloads_count?: number | null
          views_count?: number | null
          tags?: string[] | null
          is_featured?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      downloads: {
        Row: {
          id: string
          asset_id: string | null
          downloaded_at: string | null
          ip_address: string | null
        }
        Insert: {
          id?: string
          asset_id?: string | null
          downloaded_at?: string | null
          ip_address?: string | null
        }
        Update: {
          id?: string
          asset_id?: string | null
          downloaded_at?: string | null
          ip_address?: string | null
        }
      }
    }
  }
}

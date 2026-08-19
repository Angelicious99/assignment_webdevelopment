import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Product {
  id: string
  name: string
  category: 'red' | 'white' | 'accessory'
  price: number
  description: string
  image_url: string | null
  stock: number
  featured: boolean
  created_at: string
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  image_url: string | null
  author: string
  created_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  created_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}

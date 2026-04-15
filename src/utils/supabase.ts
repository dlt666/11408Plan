import { createClient } from '@supabase/supabase-js'

// 从环境变量读取（正确写法）
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// 创建客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 生成用户ID
const generateUserId = (): string => {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 10)
  return `${timestamp}-${randomStr}`
}

// 获取或创建本地用户ID
export const getOrCreateUserId = (): string => {
  let userId = localStorage.getItem('userId')
  if (!userId) {
    userId = generateUserId()
    localStorage.setItem('userId', userId)
  }
  return userId
}
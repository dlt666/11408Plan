import { createClient } from '@supabase/supabase-js'

// 从环境变量读取
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 确保环境变量存在
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

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
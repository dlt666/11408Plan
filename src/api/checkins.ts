import { supabase, getOrCreateUserId } from '../utils/supabase'

interface Checkin {
  id: string
  user_id: string
  date: string
  checked: boolean
  tasks: any[]
  created_at: string
  updated_at: string
}

// 获取用户的所有打卡记录
export const getCheckins = async (): Promise<Checkin[]> => {
  const userId = getOrCreateUserId()
  
  const { data, error } = await supabase
    .from('checkins')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
  
  if (error) {
    console.error('获取打卡记录失败:', error)
    return []
  }
  
  return data
}

// 根据日期获取打卡记录
export const getCheckinByDate = async (date: string): Promise<Checkin | null> => {
  const userId = getOrCreateUserId()
  
  const { data, error } = await supabase
    .from('checkins')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .single()
  
  if (error) {
    console.error('获取打卡记录失败:', error)
    return null
  }
  
  return data
}

// 创建或更新打卡记录
export const createOrUpdateCheckin = async (date: string, checked: boolean, tasks: any[]): Promise<Checkin | null> => {
  const userId = getOrCreateUserId()
  
  // 检查是否已存在该日期的打卡记录
  const existingCheckin = await getCheckinByDate(date)
  
  if (existingCheckin) {
    // 更新现有记录
    const { data, error } = await supabase
      .from('checkins')
      .update({
        checked,
        tasks,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingCheckin.id)
      .eq('user_id', userId)
      .select()
      .single()
    
    if (error) {
      console.error('更新打卡记录失败:', error)
      return null
    }
    
    return data
  } else {
    // 创建新记录
    const id = `checkin-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`
    
    const { data, error } = await supabase
      .from('checkins')
      .insert({
        id,
        user_id: userId,
        date,
        checked,
        tasks
      })
      .select()
      .single()
    
    if (error) {
      console.error('创建打卡记录失败:', error)
      return null
    }
    
    return data
  }
}

// 删除打卡记录
export const deleteCheckin = async (checkinId: string): Promise<boolean> => {
  const userId = getOrCreateUserId()
  
  const { error } = await supabase
    .from('checkins')
    .delete()
    .eq('id', checkinId)
    .eq('user_id', userId)
  
  if (error) {
    console.error('删除打卡记录失败:', error)
    return false
  }
  
  return true
}

// 获取打卡统计
export const getCheckinStats = async (): Promise<{
  total: number
  checked: number
  percentage: number
}> => {
  const userId = getOrCreateUserId()
  
  const { data, error } = await supabase
    .from('checkins')
    .select('checked')
    .eq('user_id', userId)
  
  if (error) {
    console.error('获取打卡统计失败:', error)
    return { total: 0, checked: 0, percentage: 0 }
  }
  
  const total = data.length
  const checked = data.filter((item: { checked: boolean }) => item.checked).length
  const percentage = total > 0 ? Math.round((checked / total) * 100) : 0
  
  return { total, checked, percentage }
}

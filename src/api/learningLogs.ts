import { supabase, getOrCreateUserId } from '../utils/supabase'

interface LearningLog {
  id: string
  user_id: string
  task_id: string
  date: string
  content: string
  duration: number
  notes: string
  created_at: string
}

// 获取用户的所有学习日志
export const getLearningLogs = async (): Promise<LearningLog[]> => {
  const userId = getOrCreateUserId()
  
  const { data, error } = await supabase
    .from('learning_logs')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
  
  if (error) {
    console.error('获取学习日志失败:', error)
    return []
  }
  
  return data
}

// 根据日期获取学习日志
export const getLearningLogsByDate = async (date: string): Promise<LearningLog[]> => {
  const userId = getOrCreateUserId()
  
  const { data, error } = await supabase
    .from('learning_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
  
  if (error) {
    console.error('获取学习日志失败:', error)
    return []
  }
  
  return data
}

// 根据任务获取学习日志
export const getLearningLogsByTask = async (taskId: string): Promise<LearningLog[]> => {
  const userId = getOrCreateUserId()
  
  const { data, error } = await supabase
    .from('learning_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('task_id', taskId)
  
  if (error) {
    console.error('获取学习日志失败:', error)
    return []
  }
  
  return data
}

// 创建新学习日志
export const createLearningLog = async (logData: Omit<LearningLog, 'id' | 'user_id' | 'created_at'>): Promise<LearningLog | null> => {
  const userId = getOrCreateUserId()
  const id = `log-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`
  
  const { data, error } = await supabase
    .from('learning_logs')
    .insert({
      id,
      user_id: userId,
      ...logData
    })
    .select()
    .single()
  
  if (error) {
    console.error('创建学习日志失败:', error)
    return null
  }
  
  return data
}

// 更新学习日志
export const updateLearningLog = async (logId: string, logData: Partial<LearningLog>): Promise<LearningLog | null> => {
  const userId = getOrCreateUserId()
  
  const { data, error } = await supabase
    .from('learning_logs')
    .update(logData)
    .eq('id', logId)
    .eq('user_id', userId)
    .select()
    .single()
  
  if (error) {
    console.error('更新学习日志失败:', error)
    return null
  }
  
  return data
}

// 删除学习日志
export const deleteLearningLog = async (logId: string): Promise<boolean> => {
  const userId = getOrCreateUserId()
  
  const { error } = await supabase
    .from('learning_logs')
    .delete()
    .eq('id', logId)
    .eq('user_id', userId)
  
  if (error) {
    console.error('删除学习日志失败:', error)
    return false
  }
  
  return true
}

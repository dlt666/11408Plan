import { supabase, getOrCreateUserId } from '../utils/supabase'

interface Task {
  id: string
  user_id: string
  subject: string
  description: string
  estimated_time: number
  actual_time: number
  status: 'pending' | 'in-progress' | 'completed'
  start_time?: string
  pause_time?: string
  paused_duration: number
  created_at: string
  updated_at: string
}

// 获取用户的所有任务
export const getTasks = async (): Promise<Task[]> => {
  const userId = getOrCreateUserId()
  
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('获取任务失败:', error)
    return []
  }
  
  return data
}

// 创建新任务
export const createTask = async (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Task | null> => {
  const userId = getOrCreateUserId()
  const id = `task-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`
  
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      id,
      user_id: userId,
      ...taskData,
      actual_time: 0,
      paused_duration: 0,
      status: 'pending'
    })
    .select()
    .single()
  
  if (error) {
    console.error('创建任务失败:', error)
    return null
  }
  
  return data
}

// 更新任务
export const updateTask = async (taskId: string, taskData: Partial<Task>): Promise<Task | null> => {
  const userId = getOrCreateUserId()
  
  const { data, error } = await supabase
    .from('tasks')
    .update({
      ...taskData,
      updated_at: new Date().toISOString()
    })
    .eq('id', taskId)
    .eq('user_id', userId)
    .select()
    .single()
  
  if (error) {
    console.error('更新任务失败:', error)
    return null
  }
  
  return data
}

// 删除任务
export const deleteTask = async (taskId: string): Promise<boolean> => {
  const userId = getOrCreateUserId()
  
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .eq('user_id', userId)
  
  if (error) {
    console.error('删除任务失败:', error)
    return false
  }
  
  return true
}

// 开始任务
export const startTask = async (taskId: string): Promise<Task | null> => {
  return updateTask(taskId, {
    status: 'in-progress',
    start_time: new Date().toISOString(),
    pause_time: undefined
  })
}

// 暂停任务
export const pauseTask = async (taskId: string, pausedDuration: number): Promise<Task | null> => {
  return updateTask(taskId, {
    status: 'pending',
    pause_time: new Date().toISOString(),
    paused_duration: pausedDuration
  })
}

// 完成任务
export const completeTask = async (taskId: string, actualTime: number): Promise<Task | null> => {
  return updateTask(taskId, {
    status: 'completed',
    actual_time: actualTime
  })
}

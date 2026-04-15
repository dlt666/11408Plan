import { supabase, getOrCreateUserId } from '../utils/supabase'

interface LearningPlan {
  id: string
  user_id: string
  name: string
  description: string
  duration: string
  start_date: string
  end_date: string
  task_times: any
  is_template: boolean
  created_at: string
}

// 获取用户的所有学习计划
export const getLearningPlans = async (): Promise<LearningPlan[]> => {
  const userId = getOrCreateUserId()
  
  const { data, error } = await supabase
    .from('learning_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('获取学习计划失败:', error)
    return []
  }
  
  return data
}

// 获取所有模板计划
export const getTemplatePlans = async (): Promise<LearningPlan[]> => {
  const { data, error } = await supabase
    .from('learning_plans')
    .select('*')
    .eq('is_template', true)
  
  if (error) {
    console.error('获取模板计划失败:', error)
    return []
  }
  
  return data
}

// 创建新学习计划
export const createLearningPlan = async (planData: Omit<LearningPlan, 'id' | 'user_id' | 'created_at'>): Promise<LearningPlan | null> => {
  const userId = getOrCreateUserId()
  const id = `plan-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`
  
  const { data, error } = await supabase
    .from('learning_plans')
    .insert({
      id,
      user_id: userId,
      ...planData
    })
    .select()
    .single()
  
  if (error) {
    console.error('创建学习计划失败:', error)
    return null
  }
  
  return data
}

// 更新学习计划
export const updateLearningPlan = async (planId: string, planData: Partial<LearningPlan>): Promise<LearningPlan | null> => {
  const userId = getOrCreateUserId()
  
  const { data, error } = await supabase
    .from('learning_plans')
    .update(planData)
    .eq('id', planId)
    .eq('user_id', userId)
    .select()
    .single()
  
  if (error) {
    console.error('更新学习计划失败:', error)
    return null
  }
  
  return data
}

// 删除学习计划
export const deleteLearningPlan = async (planId: string): Promise<boolean> => {
  const userId = getOrCreateUserId()
  
  const { error } = await supabase
    .from('learning_plans')
    .delete()
    .eq('id', planId)
    .eq('user_id', userId)
  
  if (error) {
    console.error('删除学习计划失败:', error)
    return false
  }
  
  return true
}

// 获取默认计划
export const getDefaultPlan = async (): Promise<LearningPlan | null> => {
  // 尝试获取用户的最新计划
  const plans = await getLearningPlans()
  if (plans.length > 0) {
    return plans[0]
  }
  
  // 如果没有用户计划，获取模板计划
  const templates = await getTemplatePlans()
  if (templates.length > 0) {
    return templates[0]
  }
  
  // 如果没有模板计划，创建默认计划
  return createLearningPlan({
    name: '默认学习计划',
    description: '适合时间充足的考生，包含基础、强化、冲刺三个阶段',
    duration: '6个月',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    task_times: {
      math: 120,
      english: 90,
      computer: 100,
      politics: 80
    },
    is_template: false
  })
}

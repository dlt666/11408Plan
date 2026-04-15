import { getOrCreateUserId } from '../utils/supabase'
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks'
import { getLearningLogs, createLearningLog } from '../api/learningLogs'
import { getCheckins, createOrUpdateCheckin } from '../api/checkins'
import { getLearningPlans, createLearningPlan } from '../api/learningPlans'

// 测试用户标识生成
console.log('=== 测试用户标识生成 ===')
const userId = getOrCreateUserId()
console.log('生成的用户标识:', userId)
console.log('用户标识长度:', userId.length)
console.log('用户标识格式:', /^[0-9a-z]+-[0-9a-z]+$/.test(userId) ? '正确' : '错误')

// 测试任务API
console.log('\n=== 测试任务API ===')
async function testTaskAPI() {
  try {
    // 获取任务列表
    const tasks = await getTasks()
    console.log('当前任务数量:', tasks.length)
    
    // 创建新任务
    const newTask = await createTask({
      subject: '测试科目',
      description: '测试任务描述',
      estimated_time: 60,
      actual_time: 0,
      status: 'pending',
      paused_duration: 0
    })
    
    if (newTask) {
      console.log('创建任务成功:', newTask.id)
      
      // 更新任务
      const updatedTask = await updateTask(newTask.id, {
        estimated_time: 90
      })
      console.log('更新任务成功:', updatedTask?.estimated_time === 90)
      
      // 删除任务
      const deleted = await deleteTask(newTask.id)
      console.log('删除任务成功:', deleted)
    }
  } catch (error) {
    console.error('任务API测试失败:', error)
  }
}

// 测试学习日志API
console.log('\n=== 测试学习日志API ===')
async function testLearningLogAPI() {
  try {
    // 获取学习日志列表
    const logs = await getLearningLogs()
    console.log('当前学习日志数量:', logs.length)
    
    // 创建新学习日志
    const newLog = await createLearningLog({
      task_id: 'test-task-id',
      date: new Date().toISOString().split('T')[0],
      content: '测试学习内容',
      duration: 60,
      notes: '测试学习心得'
    })
    
    if (newLog) {
      console.log('创建学习日志成功:', newLog.id)
    }
  } catch (error) {
    console.error('学习日志API测试失败:', error)
  }
}

// 测试打卡API
console.log('\n=== 测试打卡API ===')
async function testCheckinAPI() {
  try {
    // 获取打卡记录列表
    const checkins = await getCheckins()
    console.log('当前打卡记录数量:', checkins.length)
    
    // 创建或更新打卡记录
    const today = new Date().toISOString().split('T')[0]
    const checkin = await createOrUpdateCheckin(today, true, [])
    
    if (checkin) {
      console.log('创建/更新打卡记录成功:', checkin.id)
      console.log('打卡状态:', checkin.checked)
    }
  } catch (error) {
    console.error('打卡API测试失败:', error)
  }
}

// 测试学习计划API
console.log('\n=== 测试学习计划API ===')
async function testLearningPlanAPI() {
  try {
    // 获取学习计划列表
    const plans = await getLearningPlans()
    console.log('当前学习计划数量:', plans.length)
    
    // 创建新学习计划
    const newPlan = await createLearningPlan({
      name: '测试学习计划',
      description: '测试学习计划描述',
      duration: '3个月',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      task_times: {
        math: 120,
        english: 90,
        computer: 100,
        politics: 80
      },
      is_template: false
    })
    
    if (newPlan) {
      console.log('创建学习计划成功:', newPlan.id)
    }
  } catch (error) {
    console.error('学习计划API测试失败:', error)
  }
}

// 运行所有测试
async function runAllTests() {
  await testTaskAPI()
  await testLearningLogAPI()
  await testCheckinAPI()
  await testLearningPlanAPI()
  console.log('\n=== 测试完成 ===')
}

runAllTests()

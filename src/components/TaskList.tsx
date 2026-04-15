import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import FullScreenTimer from './FullScreenTimer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

interface SubTask {
  id: string
  description: string
  status: 'pending' | 'completed'
  completedAt?: number
}

interface Task {
  id: string
  subject: string
  description: string
  estimatedTime: number
  actualTime: number
  status: 'pending' | 'in-progress' | 'completed'
  startTime?: number
  pauseTime?: number
  pausedDuration?: number
  subTasks: SubTask[]
}

// 默认任务数据
const getDefaultTasks = (): Task[] => {
  return [
    {
      id: '1',
      subject: '数学一',
      description: '高等数学',
      estimatedTime: 120,
      actualTime: 0,
      status: 'pending',
      subTasks: [
        { id: '1-1', description: '函数、极限、连续', status: 'pending' },
        { id: '1-2', description: '导数与微分', status: 'pending' },
        { id: '1-3', description: '积分', status: 'pending' }
      ]
    },
    {
      id: '2',
      subject: '英语一',
      description: '词汇与阅读',
      estimatedTime: 90,
      actualTime: 0,
      status: 'pending',
      subTasks: [
        { id: '2-1', description: '考研核心词汇', status: 'pending' },
        { id: '2-2', description: '阅读理解', status: 'pending' }
      ]
    },
    {
      id: '3',
      subject: '计算机408',
      description: '数据结构',
      estimatedTime: 100,
      actualTime: 0,
      status: 'pending',
      subTasks: [
        { id: '3-1', description: '线性表', status: 'pending' },
        { id: '3-2', description: '栈与队列', status: 'pending' },
        { id: '3-3', description: '树与二叉树', status: 'pending' }
      ]
    },
    {
      id: '4',
      subject: '政治',
      description: '马克思主义基本原理',
      estimatedTime: 80,
      actualTime: 0,
      status: 'pending',
      subTasks: [
        { id: '4-1', description: '哲学', status: 'pending' },
        { id: '4-2', description: '政治经济学', status: 'pending' }
      ]
    }
  ]
}

const TaskList: React.FC = () => {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState<Task[]>(() => {
    // 从localStorage加载任务
    const savedTasks = localStorage.getItem('tasks')
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks)
        // 检查是否是空数组
        if (Array.isArray(parsedTasks) && parsedTasks.length === 0) {
          // 如果是空数组，返回默认任务
          const defaultTasks = getDefaultTasks()
          console.log('localStorage中的任务为空，返回默认任务:', defaultTasks)
          return defaultTasks
        }
        // 移除isExpanded字段（如果存在）
        const processedTasks = parsedTasks.map((task: any) => {
          const { isExpanded, ...rest } = task
          return rest
        })
        console.log('从localStorage加载任务:', processedTasks)
        return processedTasks
      } catch (error) {
        console.error('解析任务数据出错:', error)
        // 返回默认任务
        const defaultTasks = getDefaultTasks()
        console.log('返回默认任务:', defaultTasks)
        return defaultTasks
      }
    }
    // 返回默认任务
    const defaultTasks = getDefaultTasks()
    console.log('返回默认任务:', defaultTasks)
    return defaultTasks
  })

  const [timerVisible, setTimerVisible] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)

  // 保存任务到localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  // 定时更新任务时间
  useEffect(() => {
    const updateTaskTime = () => {
      setTasks(prevTasks => {
        const updatedTasks = prevTasks.map(task => {
          if (task.status === 'in-progress' && task.startTime) {
            const currentTime = Date.now()
            const pausedDuration = task.pausedDuration || 0
            const elapsedTime = Math.floor((currentTime - task.startTime - pausedDuration) / 1000 / 60)
            return { ...task, actualTime: elapsedTime }
          }
          return task
        })
        // 保存更新后的任务到localStorage
        localStorage.setItem('tasks', JSON.stringify(updatedTasks))
        return updatedTasks
      })
    }

    updateTaskTime()
    const interval = setInterval(updateTaskTime, 1000)

    return () => clearInterval(interval)
  }, [])

  // 处理编辑子任务
  const handleEditSubTask = (taskId: string, subTaskId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const subTask = tasks.find(task => task.id === taskId)?.subTasks.find(st => st.id === subTaskId)
    if (subTask) {
      const newDescription = prompt('请输入新的子任务描述:', subTask.description)
      if (newDescription && newDescription.trim()) {
        setTasks(prevTasks => {
          try {
            return prevTasks.map(task => {
              if (task.id === taskId) {
                return {
                  ...task,
                  subTasks: task.subTasks.map(st => {
                    if (st.id === subTaskId) {
                      return {
                        ...st,
                        description: newDescription.trim()
                      }
                    }
                    return st
                  })
                }
              }
              return task
            })
          } catch (error) {
            console.error('编辑子任务时出错:', error)
            return prevTasks
          }
        })
      }
    }
  }

  // 处理子任务状态变化
  const handleSubTaskStatusChange = (taskId: string, subTaskId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setTasks(prevTasks => {
      try {
        const updatedTasks: Task[] = prevTasks.map(task => {
          if (task.id === taskId) {
            const updatedSubTasks: SubTask[] = task.subTasks.map(subTask => {
              if (subTask.id === subTaskId) {
                return {
                  ...subTask,
                  status: subTask.status === 'pending' ? 'completed' : 'pending',
                  completedAt: subTask.status === 'pending' ? Date.now() : undefined
                }
              }
              return subTask
            })
            
            // 检查是否所有子任务都已完成
            const allSubTasksCompleted = updatedSubTasks.every(subTask => subTask.status === 'completed')
            
            if (allSubTasksCompleted) {
              // 所有子任务完成，自动标记学科为完成
              const currentTime = Date.now()
              const pausedDuration = task.pausedDuration || 0
              const elapsedTime = Math.floor((currentTime - (task.startTime || currentTime) - pausedDuration) / 1000 / 60)
              return {
                ...task,
                subTasks: updatedSubTasks,
                status: 'completed' as const,
                actualTime: elapsedTime
              }
            }
            
            return {
              ...task,
              subTasks: updatedSubTasks
            }
          }
          return task
        })
        return updatedTasks
      } catch (error) {
        console.error('处理子任务状态变化时出错:', error)
        return prevTasks
      }
    })
  }

  // 处理添加子任务
  const handleAddSubTask = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newSubTaskDescription = prompt('请输入子任务描述:')
    if (newSubTaskDescription && newSubTaskDescription.trim()) {
      setTasks(prevTasks => {
        try {
          return prevTasks.map(task => {
            if (task.id === taskId) {
              const newSubTask: SubTask = {
                id: `${taskId}-${Date.now()}`,
                description: newSubTaskDescription.trim(),
                status: 'pending'
              }
              return {
                ...task,
                subTasks: [...task.subTasks, newSubTask]
              }
            }
            return task
          })
        } catch (error) {
          console.error('添加子任务时出错:', error)
          return prevTasks
        }
      })
    }
  }

  // 处理删除子任务
  const handleDeleteSubTask = (taskId: string, subTaskId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('确定要删除这个子任务吗？')) {
      setTasks(prevTasks => {
        try {
          return prevTasks.map(task => {
            if (task.id === taskId) {
              return {
                ...task,
                subTasks: task.subTasks.filter(subTask => subTask.id !== subTaskId)
              }
            }
            return task
          })
        } catch (error) {
          console.error('删除子任务时出错:', error)
          return prevTasks
        }
      })
    }
  }

  const handleStartTask = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      setCurrentTask(task)
      setTimerVisible(true)
    }
    
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status: 'in-progress', 
              startTime: Date.now(),
              pauseTime: undefined
            } 
          : task
      )
    )
  }

  const handlePauseTask = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId && task.status === 'in-progress' && task.startTime) {
          const pauseTime = Date.now()
          const pausedDuration = task.pausedDuration || 0
          const newPausedDuration = pausedDuration + (pauseTime - task.startTime)
          return { 
            ...task, 
            status: 'pending', 
            pauseTime,
            pausedDuration: newPausedDuration
          }
        }
        return task
      })
    )
  }

  const handleFinishTask = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: 'completed' } 
          : task
      )
    )
  }

  const handleEstimatedTimeChange = (taskId: string, time: number, e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, estimatedTime: time } 
          : task
      )
    )
  }

  const handleTimerClose = () => {
    setTimerVisible(false)
  }

  const handleTimerFinish = (duration: number) => {
    if (currentTask) {
      const minutes = Math.floor(duration / 60)
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === currentTask.id 
            ? { ...task, status: 'completed', actualTime: minutes } 
            : task
        )
      )
    }
    setTimerVisible(false)
  }

  return (
    <div className="task-list">
      <h2>每日学习任务</h2>
      {tasks && tasks.length > 0 ? (
        tasks.map(task => (
          <React.Fragment key={task.id}>
            <div 
              className="task-item" 
              onClick={() => navigate(`/tasks/${task.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="task-header">
                <span className="task-subject">{task.subject}</span>
                <div className="task-time">
                  <span>预计: </span>
                  <input 
                    type="number" 
                    min="1" 
                    value={task.estimatedTime} 
                    onChange={(e) => {
                      try {
                        handleEstimatedTimeChange(task.id, parseInt(e.target.value) || 1, e);
                      } catch (error) {
                        console.error('修改预计时间出错:', error);
                      }
                    }}
                    style={{ 
                      width: '60px', 
                      padding: '0.2rem', 
                      borderRadius: '4px', 
                      border: '1px solid var(--border-color)',
                      margin: '0 0.5rem'
                    }}
                  />
                  <span>分钟 | 实际: {task.actualTime}分钟</span>
                </div>
              </div>
              <div className="task-description">{task.description}</div>
              <div className="task-actions">
                {task.status === 'pending' && (
                  <button 
                    className="start" 
                    onClick={(e) => {
                      e.stopPropagation();
                      try {
                        handleStartTask(task.id, e);
                      } catch (error) {
                        console.error('开始任务出错:', error);
                      }
                    }}
                  >
                    开始
                  </button>
                )}
                {task.status === 'in-progress' && (
                  <>
                    <button 
                      className="pause" 
                      onClick={(e) => {
                        e.stopPropagation();
                        try {
                          handlePauseTask(task.id, e);
                        } catch (error) {
                          console.error('暂停任务出错:', error);
                        }
                      }}
                    >
                      暂停
                    </button>
                    <button 
                      className="finish" 
                      onClick={(e) => {
                        e.stopPropagation();
                        try {
                          handleFinishTask(task.id, e);
                        } catch (error) {
                          console.error('结束任务出错:', error);
                        }
                      }}
                    >
                      结束
                    </button>
                  </>
                )}
                {task.status === 'completed' && (
                  <span style={{ color: 'var(--success-color)', fontWeight: 'bold' }}>
                    已完成
                  </span>
                )}
              </div>
            </div>
            
            {/* 子任务列表 */}
            {task.subTasks && (
              <div className="subtasks-container">
                {task.subTasks.map(subTask => (
                  <div key={subTask.id} className="subtask-item" onClick={(e) => e.stopPropagation()}>
                    <div 
                      className="subtask-checkbox" 
                      onClick={(e) => {
                        e.stopPropagation();
                        try {
                          handleSubTaskStatusChange(task.id, subTask.id, e);
                        } catch (error) {
                          console.error('修改子任务状态出错:', error);
                        }
                      }}
                    >
                      {subTask.status === 'completed' ? (
                        <FontAwesomeIcon icon={faCheck} className="check-icon" />
                      ) : (
                        <div className="checkbox-empty"></div>
                      )}
                    </div>
                    <div className="subtask-description">{subTask.description}</div>
                    <div className="subtask-status">
                      {subTask.status === 'completed' && (
                        <span style={{ color: 'var(--success-color)', fontWeight: 'bold' }}>
                          已完成
                        </span>
                      )}
                    </div>
                    <div className="subtask-actions">
                      <button 
                        className="edit-subtask" 
                        onClick={(e) => {
                          e.stopPropagation();
                          try {
                            handleEditSubTask(task.id, subTask.id, e);
                          } catch (error) {
                            console.error('编辑子任务出错:', error);
                          }
                        }}
                        title="编辑子任务"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button 
                        className="delete-subtask" 
                        onClick={(e) => {
                          e.stopPropagation();
                          try {
                            handleDeleteSubTask(task.id, subTask.id, e);
                          } catch (error) {
                            console.error('删除子任务出错:', error);
                          }
                        }}
                        title="删除子任务"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="add-subtask">
                  <button 
                    className="add-subtask-button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      try {
                        handleAddSubTask(task.id, e);
                      } catch (error) {
                        console.error('添加子任务出错:', error);
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    添加子任务
                  </button>
                </div>
              </div>
            )}
          </React.Fragment>
        ))
      ) : (
        <div className="no-tasks">
          <p>暂无任务，请先创建学习计划</p>
        </div>
      )}
      
      {currentTask && (
        <FullScreenTimer 
          isVisible={timerVisible}
          onClose={handleTimerClose}
          onFinish={handleTimerFinish}
          taskName={`${currentTask.subject}: ${currentTask.description}`}
        />
      )}
    </div>
  )
}

export default TaskList
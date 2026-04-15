import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCheckCircle, faClock, faEdit, faSave } from '@fortawesome/free-solid-svg-icons'

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
}

interface LearningLog {
  id: string
  taskId: string
  date: string
  content: string
  duration: number
  notes: string
}

const TaskDetail: React.FC = () => {
  const { id: taskId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  // 如果没有taskId，重定向到任务列表
  if (!taskId) {
    navigate('/tasks')
    return null
  }
  const [task, setTask] = useState<Task | null>(null)
  const [logs, setLogs] = useState<LearningLog[]>([])
  const [newLog, setNewLog] = useState({
    content: '',
    notes: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState<Task | null>(null)

  useEffect(() => {
    if (!taskId) return
    // 加载任务数据
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    const foundTask = tasks.find((t: Task) => t.id === taskId)
    if (foundTask) {
      setTask(foundTask)
      setEditedTask({ ...foundTask })
    }

    // 加载学习日志
    const allLogs = JSON.parse(localStorage.getItem('learningLogs') || '[]')
    const taskLogs = allLogs.filter((log: LearningLog) => log.taskId === taskId)
    setLogs(taskLogs)
  }, [taskId])

  const handleStartTask = () => {
    if (!task || !taskId) return
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    const updatedTasks = tasks.map((t: Task) => 
      t.id === taskId 
        ? { ...t, status: 'in-progress', startTime: Date.now(), pauseTime: undefined }
        : t
    )
    localStorage.setItem('tasks', JSON.stringify(updatedTasks))
    setTask(updatedTasks.find((t: Task) => t.id === taskId))
  }

  const handlePauseTask = () => {
    if (!task || !taskId || task.status !== 'in-progress' || !task.startTime) return
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    const pauseTime = Date.now()
    const pausedDuration = task.pausedDuration || 0
    const newPausedDuration = pausedDuration + (pauseTime - task.startTime)
    const updatedTasks = tasks.map((t: Task) => 
      t.id === taskId 
        ? { ...t, status: 'pending', pauseTime, pausedDuration: newPausedDuration }
        : t
    )
    localStorage.setItem('tasks', JSON.stringify(updatedTasks))
    setTask(updatedTasks.find((t: Task) => t.id === taskId))
  }

  const handleFinishTask = () => {
    if (!task || !taskId) return
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    const updatedTasks = tasks.map((t: Task) => 
      t.id === taskId 
        ? { ...t, status: 'completed' }
        : t
    )
    localStorage.setItem('tasks', JSON.stringify(updatedTasks))
    setTask(updatedTasks.find((t: Task) => t.id === taskId))
  }

  const handleSaveLog = () => {
    if (!task || !taskId || !newLog.content) return
    const allLogs = JSON.parse(localStorage.getItem('learningLogs') || '[]')
    const newLearningLog: LearningLog = {
      id: Date.now().toString(),
      taskId: taskId,
      date: new Date().toISOString().split('T')[0],
      content: newLog.content,
      duration: task.actualTime,
      notes: newLog.notes
    }
    const updatedLogs = [newLearningLog, ...allLogs]
    localStorage.setItem('learningLogs', JSON.stringify(updatedLogs))
    setLogs([newLearningLog, ...logs])
    setNewLog({ content: '', notes: '' })
  }

  const handleUpdateTask = () => {
    if (!editedTask || !taskId) return
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    const updatedTasks = tasks.map((t: Task) => 
      t.id === taskId 
        ? editedTask
        : t
    )
    localStorage.setItem('tasks', JSON.stringify(updatedTasks))
    setTask(editedTask)
    setIsEditing(false)
  }

  if (!task) {
    return (
      <div className="task-detail">
        <div className="detail-header">
          <button className="back-button" onClick={() => navigate('/tasks')}>
            <FontAwesomeIcon icon={faArrowLeft} /> 返回
          </button>
          <h2>任务详情</h2>
        </div>
        <div className="loading">加载中...</div>
      </div>
    )
  }

  return (
    <div className="task-detail">
      <div className="detail-header">
        <button className="back-button" onClick={() => navigate('/tasks')}>
          <FontAwesomeIcon icon={faArrowLeft} /> 返回
        </button>
        <h2>任务详情</h2>
        {!isEditing && (
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            <FontAwesomeIcon icon={faEdit} /> 编辑
          </button>
        )}
        {isEditing && (
          <button className="save-button" onClick={handleUpdateTask}>
            <FontAwesomeIcon icon={faSave} /> 保存
          </button>
        )}
      </div>

      <div className="task-info">
        {isEditing && editedTask ? (
          <div className="edit-form">
            <div className="form-group">
              <label>科目：</label>
              <input 
                type="text" 
                value={editedTask.subject} 
                onChange={(e) => setEditedTask({ ...editedTask, subject: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>任务描述：</label>
              <textarea 
                value={editedTask.description} 
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>预计时间：</label>
              <input 
                type="number" 
                min="1" 
                value={editedTask.estimatedTime} 
                onChange={(e) => setEditedTask({ ...editedTask, estimatedTime: parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>
        ) : (
          <div className="task-details">
            <div className="detail-item">
              <span className="detail-label">科目：</span>
              <span className="detail-value">{task.subject}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">任务描述：</span>
              <span className="detail-value">{task.description}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">预计时间：</span>
              <span className="detail-value">{task.estimatedTime} 分钟</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">实际时间：</span>
              <span className="detail-value">{task.actualTime} 分钟</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">状态：</span>
              <span className={`detail-value status-${task.status}`}>
                {task.status === 'pending' ? '待开始' : task.status === 'in-progress' ? '进行中' : '已完成'}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="task-actions">
        {task.status === 'pending' && (
          <button className="start-button" onClick={handleStartTask}>
            <FontAwesomeIcon icon={faClock} /> 开始
          </button>
        )}
        {task.status === 'in-progress' && (
          <>
            <button className="pause-button" onClick={handlePauseTask}>
              <FontAwesomeIcon icon={faClock} /> 暂停
            </button>
            <button className="finish-button" onClick={handleFinishTask}>
              <FontAwesomeIcon icon={faCheckCircle} /> 完成
            </button>
          </>
        )}
        {task.status === 'completed' && (
          <span className="completed-badge">
            <FontAwesomeIcon icon={faCheckCircle} /> 已完成
          </span>
        )}
      </div>

      <div className="learning-log-section">
        <h3>学习日志</h3>
        <div className="log-form">
          <textarea 
            placeholder="记录学习内容..."
            value={newLog.content}
            onChange={(e) => setNewLog({ ...newLog, content: e.target.value })}
            rows={4}
          />
          <textarea 
            placeholder="学习心得..."
            value={newLog.notes}
            onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
            rows={2}
          />
          <button className="save-log-button" onClick={handleSaveLog}>
            <FontAwesomeIcon icon={faSave} /> 保存日志
          </button>
        </div>

        <div className="log-list">
          {logs.length === 0 ? (
            <div className="no-logs">暂无学习日志</div>
          ) : (
            logs.map(log => (
              <div key={log.id} className="log-item">
                <div className="log-header">
                  <span className="log-date">{log.date}</span>
                  <span className="log-duration">{log.duration} 分钟</span>
                </div>
                <div className="log-content">{log.content}</div>
                {log.notes && (
                  <div className="log-notes">{log.notes}</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskDetail
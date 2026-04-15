import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CheckinCalendar from './CheckinCalendar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faClock, faBookOpen } from '@fortawesome/free-solid-svg-icons'

interface CheckinData {
  date: string
  checked: boolean
  tasks: {
    id: string
    subject: string
    duration: number
  }[]
  logs: {
    id: string
    taskId: string
    content: string
    notes: string
  }[]
}

interface LearningLog {
  id: string
  taskId: string
  date: string
  content: string
  duration: number
  notes: string
}

const CheckinManager: React.FC = () => {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [checkins, setCheckins] = useState<CheckinData[]>(() => {
    const savedCheckins = localStorage.getItem('checkins')
    return savedCheckins ? JSON.parse(savedCheckins) : []
  })
  const [selectedCheckin, setSelectedCheckin] = useState<CheckinData | null>(null)

  useEffect(() => {
    localStorage.setItem('checkins', JSON.stringify(checkins))
  }, [checkins])

  useEffect(() => {
    // 加载学习日志
    const allLogs = JSON.parse(localStorage.getItem('learningLogs') || '[]')
    const filteredLogs = allLogs.filter((log: LearningLog) => log.date === selectedDate)
    
    // 查找或创建当天的打卡记录
    const existingCheckin = checkins.find(c => c.date === selectedDate)
    if (existingCheckin) {
      setSelectedCheckin({ ...existingCheckin, logs: filteredLogs })
    } else {
      const newCheckin: CheckinData = {
        date: selectedDate,
        checked: false,
        tasks: [],
        logs: filteredLogs
      }
      setSelectedCheckin(newCheckin)
    }
  }, [selectedDate, checkins])

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
  }

  const handleCheckin = () => {
    if (!selectedCheckin) return
    
    // 检查是否是当天日期
    const today = new Date().toISOString().split('T')[0]
    if (selectedCheckin.date !== today) {
      alert('只能对当天日期进行打卡操作')
      return
    }
    
    // 加载当天的任务
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    const completedTasks = tasks.filter((task: any) => task.status === 'completed')
    
    const taskSummaries = completedTasks.map((task: any) => ({
      id: task.id,
      subject: task.subject,
      duration: task.actualTime
    }))

    const updatedCheckin: CheckinData = {
      ...selectedCheckin,
      checked: true,
      tasks: taskSummaries
    }

    const updatedCheckins = checkins.filter(c => c.date !== selectedDate)
    updatedCheckins.push(updatedCheckin)
    setCheckins(updatedCheckins)
    setSelectedCheckin(updatedCheckin)
  }

  return (
    <div className="checkin-manager">
      <h2>每日打卡</h2>
      <CheckinCalendar 
        onDateSelect={handleDateSelect}
        selectedDate={selectedDate}
      />
      
      {selectedCheckin && (
        <div className="checkin-details">
          <div className="checkin-header">
            <h3>{selectedCheckin.date} 打卡详情</h3>
            {!selectedCheckin.checked && selectedCheckin.date === new Date().toISOString().split('T')[0] && (
              <button className="checkin-button" onClick={handleCheckin}>
                <FontAwesomeIcon icon={faCheckCircle} /> 打卡
              </button>
            )}
            {selectedCheckin.checked && (
              <span className="checked-badge">
                <FontAwesomeIcon icon={faCheckCircle} /> 已打卡
              </span>
            )}
          </div>
          
          <div className="checkin-content">
            <div className="tasks-section">
              <h4>学习任务</h4>
              {selectedCheckin.tasks.length > 0 ? (
                <ul className="task-list">
                  {selectedCheckin.tasks.map(task => (
                    <li key={task.id} onClick={() => navigate(`/tasks/${task.id}`)} style={{ cursor: 'pointer' }}>
                      <span className="task-subject">{task.subject}</span>
                      <span className="task-duration">
                        <FontAwesomeIcon icon={faClock} /> {task.duration} 分钟
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-tasks">暂无学习任务</p>
              )}
            </div>
            
            <div className="logs-section">
              <h4>学习日志</h4>
              {selectedCheckin.logs.length > 0 ? (
                <div className="log-list">
                  {selectedCheckin.logs.map(log => (
                    <div key={log.id} className="log-item" onClick={() => navigate(`/tasks/${log.taskId}`)} style={{ cursor: 'pointer' }}>
                      <div className="log-header">
                        <FontAwesomeIcon icon={faBookOpen} />
                      </div>
                      <div className="log-content">{log.content}</div>
                      {log.notes && (
                        <div className="log-notes">{log.notes}</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-logs">暂无学习日志</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CheckinManager
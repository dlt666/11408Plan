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
    mistakes?: {
      id: string
      question: string
      wrongAnswer: string
      correctAnswer: string
      reason: string
    }[]
  }[]
  logs: {
    id: string
    taskId: string
    content: string
    notes: string
  }[]
}

interface MistakeRecord {
  id: string
  taskId: string
  date: string
  question: string
  wrongAnswer: string
  correctAnswer: string
  reason: string
  subject: string
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
    
    // 加载错题记录
    const allMistakes = JSON.parse(localStorage.getItem('mistakeRecords') || '[]')
    const filteredMistakes = allMistakes.filter((mistake: MistakeRecord) => mistake.date === selectedDate)
    
    // 加载当天的任务
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    
    // 查找或创建当天的打卡记录
    const existingCheckin = checkins.find(c => c.date === selectedDate)
    if (existingCheckin) {
      // 为现有打卡记录添加错题信息
      const updatedTasks = existingCheckin.tasks.map(task => {
        const taskMistakes = filteredMistakes.filter((mistake: MistakeRecord) => mistake.taskId === task.id)
        return {
          ...task,
          mistakes: taskMistakes.map((mistake: MistakeRecord) => ({
            id: mistake.id,
            question: mistake.question,
            wrongAnswer: mistake.wrongAnswer,
            correctAnswer: mistake.correctAnswer,
            reason: mistake.reason
          }))
        }
      })
      setSelectedCheckin({ ...existingCheckin, logs: filteredLogs, tasks: updatedTasks })
    } else {
      // 为未打卡的日期创建任务列表
      const taskSummaries = tasks.map((task: any) => {
        const taskMistakes = filteredMistakes.filter((mistake: MistakeRecord) => mistake.taskId === task.id)
        return {
          id: task.id,
          subject: task.subject,
          duration: task.actualTime || 0,
          mistakes: taskMistakes.map((mistake: MistakeRecord) => ({
            id: mistake.id,
            question: mistake.question,
            wrongAnswer: mistake.wrongAnswer,
            correctAnswer: mistake.correctAnswer,
            reason: mistake.reason
          }))
        }
      })
      const newCheckin: CheckinData = {
        date: selectedDate,
        checked: false,
        tasks: taskSummaries,
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
    
    // 加载当天的错题记录
    const allMistakes = JSON.parse(localStorage.getItem('mistakeRecords') || '[]')
    const todayMistakes = allMistakes.filter((mistake: MistakeRecord) => mistake.date === today)
    
    const taskSummaries = tasks.map((task: any) => {
      // 查找该任务对应的错题
      const taskMistakes = todayMistakes.filter((mistake: MistakeRecord) => mistake.taskId === task.id)
      return {
        id: task.id,
        subject: task.subject,
        duration: task.actualTime || 0,
        mistakes: taskMistakes.map((mistake: MistakeRecord) => ({
          id: mistake.id,
          question: mistake.question,
          wrongAnswer: mistake.wrongAnswer,
          correctAnswer: mistake.correctAnswer,
          reason: mistake.reason
        }))
      }
    })

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
                <div className="task-list">
                  {selectedCheckin.tasks.map(task => (
                    <div key={task.id} className="task-item" onClick={() => navigate(`/tasks/${task.id}`)} style={{ cursor: 'pointer' }}>
                      <div className="task-header">
                        <span className="task-subject">{task.subject}</span>
                        <span className="task-duration">
                          <FontAwesomeIcon icon={faClock} /> {task.duration} 分钟
                        </span>
                      </div>
                      {task.mistakes && task.mistakes.length > 0 && (
                        <div className="task-mistakes">
                          <h5>错题记录 ({task.mistakes.length}题)</h5>
                          <div className="mistakes-list">
                            {task.mistakes.map((mistake, index) => (
                              <div key={mistake.id} className="mistake-item">
                                <div className="mistake-question">
                                  <strong>{index + 1}. {mistake.question}</strong>
                                </div>
                                <div className="mistake-answers">
                                  <div className="wrong-answer">错误答案: {mistake.wrongAnswer}</div>
                                  <div className="correct-answer">正确答案: {mistake.correctAnswer}</div>
                                </div>
                                {mistake.reason && (
                                  <div className="mistake-reason">错误原因: {mistake.reason}</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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
import React, { useState } from 'react'

interface LearningLogEntry {
  id: string
  date: string
  subject: string
  summary: string
  mistakes: string
  weakPoints: string
  improvementPlan: string
}

const LearningLog: React.FC = () => {
  const [logs, setLogs] = useState<LearningLogEntry[]>([
    {
      id: '1',
      date: '2026-04-15',
      subject: '数学一',
      summary: '今天复习了高等数学第一章，感觉基础概念掌握得还可以，但是在极限计算方面还有些问题。',
      mistakes: '在计算复杂极限时容易出错，特别是涉及到洛必达法则的应用。',
      weakPoints: '极限的证明题和复杂计算',
      improvementPlan: '明天多做一些极限相关的练习题，重点关注洛必达法则的应用条件。'
    }
  ])

  const [newLog, setNewLog] = useState({
    subject: '数学一',
    summary: '',
    mistakes: '',
    weakPoints: '',
    improvementPlan: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewLog(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const log: LearningLogEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...newLog
    }
    setLogs(prev => [log, ...prev])
    // 重置表单
    setNewLog({
      subject: '数学一',
      summary: '',
      mistakes: '',
      weakPoints: '',
      improvementPlan: ''
    })
  }

  return (
    <div className="learning-log">
      <h2>学习日志</h2>
      
      <div className="log-form">
        <h3>添加学习日志</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              科目：
              <select 
                name="subject" 
                value={newLog.subject} 
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
              >
                <option value="数学一">数学一</option>
                <option value="英语一">英语一</option>
                <option value="计算机408">计算机408</option>
                <option value="政治">政治</option>
              </select>
            </label>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>今日学习感想总结：</label>
            <textarea 
              name="summary" 
              value={newLog.summary} 
              onChange={handleInputChange}
              placeholder="请输入今日学习感想总结..."
            ></textarea>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>错题集记录：</label>
            <textarea 
              name="mistakes" 
              value={newLog.mistakes} 
              onChange={handleInputChange}
              placeholder="请记录今日的错题..."
            ></textarea>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>薄弱环节分析：</label>
            <textarea 
              name="weakPoints" 
              value={newLog.weakPoints} 
              onChange={handleInputChange}
              placeholder="请分析今日发现的薄弱环节..."
            ></textarea>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>改进计划：</label>
            <textarea 
              name="improvementPlan" 
              value={newLog.improvementPlan} 
              onChange={handleInputChange}
              placeholder="请制定明日的改进计划..."
            ></textarea>
          </div>
          <button type="submit">保存日志</button>
        </form>
      </div>
      
      <div className="log-list">
        <h3>历史日志</h3>
        {logs.map(log => (
          <div key={log.id} className="log-item">
            <h4>{log.subject} - {log.date}</h4>
            <p><strong>学习感想：</strong>{log.summary}</p>
            <p><strong>错题记录：</strong>{log.mistakes}</p>
            <p><strong>薄弱环节：</strong>{log.weakPoints}</p>
            <p><strong>改进计划：</strong>{log.improvementPlan}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LearningLog
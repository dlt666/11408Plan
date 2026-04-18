import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faTrash, faSave, faCancel, faCalendar, faClock, faBullseye } from '@fortawesome/free-solid-svg-icons'

interface PlanTemplate {
  id: string
  name: string
  description: string
  duration: string
  taskTimes: {
    math: number
    english: number
    computer: number
    politics: number
  }
  startDate?: string
  endDate?: string
}

const planTemplates: PlanTemplate[] = [
  {
    id: '6months',
    name: '六个月备考计划',
    description: '适合时间充足的考生，包含基础、强化、冲刺三个阶段，全面覆盖数学一、英语一、政治及计算机408科目。',
    duration: '6个月',
    taskTimes: {
      math: 120,
      english: 90,
      computer: 100,
      politics: 80
    }
  },
  {
    id: '3months',
    name: '三个月备考计划',
    description: '适合时间紧张的考生，浓缩精华内容，重点突破核心知识点，高效备考。',
    duration: '3个月',
    taskTimes: {
      math: 150,
      english: 100,
      computer: 120,
      politics: 90
    }
  }
]

interface PlanManagerProps {
  onPlanSelect?: (plan: PlanTemplate) => void
}

const PlanManager: React.FC<PlanManagerProps> = ({ onPlanSelect }) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(() => {
    return localStorage.getItem('selectedPlan') || null
  })
  const [customPlans, setCustomPlans] = useState<PlanTemplate[]>(() => {
    const savedPlans = localStorage.getItem('customPlans')
    return savedPlans ? JSON.parse(savedPlans) : []
  })
  const [isCreating, setIsCreating] = useState(false)
  const [editingPlan, setEditingPlan] = useState<PlanTemplate | null>(null)
  const [newPlan, setNewPlan] = useState<PlanTemplate>({
    id: '',
    name: '',
    description: '',
    duration: '',
    taskTimes: {
      math: 100,
      english: 80,
      computer: 90,
      politics: 70
    },
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })

  // 保存自定义计划到localStorage
  useEffect(() => {
    localStorage.setItem('customPlans', JSON.stringify(customPlans))
  }, [customPlans])

  useEffect(() => {
    if (selectedPlan) {
      const allPlans = [...planTemplates, ...customPlans]
      const plan = allPlans.find(p => p.id === selectedPlan)
      if (plan && onPlanSelect) {
        onPlanSelect(plan)
      }
    }
  }, [selectedPlan, onPlanSelect, customPlans])

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
    localStorage.setItem('selectedPlan', planId)
  }

  const handleCreatePlan = () => {
    setIsCreating(true)
    setNewPlan({
      id: Date.now().toString(),
      name: '',
      description: '',
      duration: '',
      taskTimes: {
        math: 100,
        english: 80,
        computer: 90,
        politics: 70
      },
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    })
  }

  const handleSavePlan = () => {
    if (newPlan.name) {
      if (isCreating) {
        setCustomPlans([...customPlans, newPlan])
      } else if (editingPlan) {
        setCustomPlans(customPlans.map(plan => 
          plan.id === editingPlan.id ? newPlan : plan
        ))
      }
      setIsCreating(false)
      setEditingPlan(null)
    }
  }

  const handleEditPlan = (plan: PlanTemplate) => {
    setEditingPlan(plan)
    setNewPlan({ ...plan })
    setIsCreating(false)
  }

  const handleDeletePlan = (planId: string) => {
    setCustomPlans(customPlans.filter(plan => plan.id !== planId))
    if (selectedPlan === planId) {
      setSelectedPlan(null)
      localStorage.removeItem('selectedPlan')
    }
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingPlan(null)
  }

  const allPlans = [...planTemplates, ...customPlans]

  return (
    <div className="plan-manager">
      <div className="page-title">
        <div className="page-title-icon">
          <FontAwesomeIcon icon={faCalendar} />
        </div>
        <h2 className="page-title-text">学习计划管理</h2>
      </div>
      <div className="plan-header">
        <button className="create-button" onClick={handleCreatePlan}>
          <FontAwesomeIcon icon={faPlus} /> 创建计划
        </button>
      </div>

      {isCreating || editingPlan ? (
        <div className="plan-form">
          <h3>{isCreating ? '创建自定义计划' : '编辑计划'}</h3>
          <div className="form-group">
            <label>计划名称：</label>
            <input 
              type="text" 
              value={newPlan.name} 
              onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
              placeholder="输入计划名称"
            />
          </div>
          <div className="form-group">
            <label>计划描述：</label>
            <textarea 
              value={newPlan.description} 
              onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
              placeholder="输入计划描述"
              rows={3}
            />
          </div>
          <div className="form-group">
            <label>计划时长：</label>
            <input 
              type="text" 
              value={newPlan.duration} 
              onChange={(e) => setNewPlan({ ...newPlan, duration: e.target.value })}
              placeholder="例如：3个月"
            />
          </div>
          <div className="form-group">
            <label>开始日期：</label>
            <input 
              type="date" 
              value={newPlan.startDate} 
              onChange={(e) => setNewPlan({ ...newPlan, startDate: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>截止日期：</label>
            <input 
              type="date" 
              value={newPlan.endDate} 
              onChange={(e) => setNewPlan({ ...newPlan, endDate: e.target.value })}
            />
          </div>
          <div className="time-allocation">
            <h4>每日时间分配</h4>
            <div className="time-item">
              <label>数学一：</label>
              <input 
                type="number" 
                min="1" 
                value={newPlan.taskTimes.math} 
                onChange={(e) => setNewPlan({ ...newPlan, taskTimes: { ...newPlan.taskTimes, math: parseInt(e.target.value) || 1 } })}
              />
              <span>分钟</span>
            </div>
            <div className="time-item">
              <label>英语一：</label>
              <input 
                type="number" 
                min="1" 
                value={newPlan.taskTimes.english} 
                onChange={(e) => setNewPlan({ ...newPlan, taskTimes: { ...newPlan.taskTimes, english: parseInt(e.target.value) || 1 } })}
              />
              <span>分钟</span>
            </div>
            <div className="time-item">
              <label>计算机408：</label>
              <input 
                type="number" 
                min="1" 
                value={newPlan.taskTimes.computer} 
                onChange={(e) => setNewPlan({ ...newPlan, taskTimes: { ...newPlan.taskTimes, computer: parseInt(e.target.value) || 1 } })}
              />
              <span>分钟</span>
            </div>
            <div className="time-item">
              <label>政治：</label>
              <input 
                type="number" 
                min="1" 
                value={newPlan.taskTimes.politics} 
                onChange={(e) => setNewPlan({ ...newPlan, taskTimes: { ...newPlan.taskTimes, politics: parseInt(e.target.value) || 1 } })}
              />
              <span>分钟</span>
            </div>
          </div>
          <div className="form-actions">
            <button className="save-button" onClick={handleSavePlan}>
              <FontAwesomeIcon icon={faSave} /> 保存
            </button>
            <button className="cancel-button" onClick={handleCancel}>
              <FontAwesomeIcon icon={faCancel} /> 取消
            </button>
          </div>
        </div>
      ) : (
        <div className="plan-templates">
          {allPlans.map(plan => (
            <div key={plan.id} className="plan-template">
              <div className="plan-header">
                <h3>{plan.name}</h3>
                {planTemplates.find(p => p.id === plan.id) ? null : (
                  <div className="plan-actions">
                    <button className="edit-button" onClick={() => handleEditPlan(plan)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="delete-button" onClick={() => handleDeletePlan(plan.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                )}
              </div>
              <p>{plan.description}</p>
              <p><strong>时长：</strong>{plan.duration}</p>
              {plan.startDate && plan.endDate && (
                <>
                  <p><strong>开始日期：</strong>{plan.startDate}</p>
                  <p><strong>截止日期：</strong>{plan.endDate}</p>
                </>
              )}
              <p><strong>每日学习时间分配：</strong></p>
              <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                <li>数学一：{plan.taskTimes.math}分钟</li>
                <li>英语一：{plan.taskTimes.english}分钟</li>
                <li>计算机408：{plan.taskTimes.computer}分钟</li>
                <li>政治：{plan.taskTimes.politics}分钟</li>
              </ul>
              <button 
                className={`select-button ${selectedPlan === plan.id ? 'selected' : ''}`}
                onClick={() => handleSelectPlan(plan.id)}
              >
                {selectedPlan === plan.id ? '已选择' : '选择计划'}
              </button>
            </div>
          ))}
        </div>
      )}
      
      {selectedPlan && (
        <div className="card current-plan">
          <h3>当前计划</h3>
          <p>您已选择：{allPlans.find(p => p.id === selectedPlan)?.name}</p>
          <p>该计划将帮助您系统备考，祝您考研成功！</p>
        </div>
      )}
    </div>
  )
}

export default PlanManager
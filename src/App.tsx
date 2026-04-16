import { useLocation, useNavigate, Routes, Route } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faCalendarAlt, faTasks, faCheckSquare } from '@fortawesome/free-solid-svg-icons'
import HomePage from './components/HomePage'
import TaskList from './components/TaskList'
import PlanManager from './components/PlanManager'
import TaskDetail from './components/TaskDetail'
import CheckinManager from './components/CheckinManager'

// 404页面
const NotFound = () => {
  const navigate = useNavigate()
  return (
    <div className="not-found">
      <h2>404 - 页面不存在</h2>
      <p>您访问的页面不存在，请返回首页。</p>
      <button onClick={() => navigate('/')} className="back-home">
        <FontAwesomeIcon icon={faHome} />
        返回首页
      </button>
    </div>
  )
}

// 导航栏组件
const Navigation = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const getActiveTab = () => {
    const path = location.pathname
    if (path === '/') return 'home'
    if (path === '/plan') return 'plan'
    if (path.startsWith('/tasks')) return 'tasks'
    if (path === '/checkin') return 'checkin'
    return ''
  }

  return (
    <nav className="app-nav">
      <button 
        className={getActiveTab() === 'home' ? 'active' : ''} 
        onClick={() => navigate('/')}
      >
        <FontAwesomeIcon icon={faHome} />
        <span>首页</span>
      </button>
      <button 
        className={getActiveTab() === 'plan' ? 'active' : ''} 
        onClick={() => navigate('/plan')}
      >
        <FontAwesomeIcon icon={faCalendarAlt} />
        <span>学习计划</span>
      </button>
      <button 
        className={getActiveTab() === 'tasks' ? 'active' : ''} 
        onClick={() => navigate('/tasks')}
      >
        <FontAwesomeIcon icon={faTasks} />
        <span>每日任务</span>
      </button>
      <button 
        className={getActiveTab() === 'checkin' ? 'active' : ''} 
        onClick={() => navigate('/checkin')}
      >
        <FontAwesomeIcon icon={faCheckSquare} />
        <span>每日打卡</span>
      </button>
    </nav>
  )
}

// 应用主组件
function App() {
  const location = useLocation()

  // 检查是否显示导航栏（任务详情页不显示）
  const showNavigation = !location.pathname.startsWith('/tasks/')

  return (
    <div className="app">
      <main className="app-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/plan" element={<PlanManager />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />
          <Route path="/checkin" element={<CheckinManager />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      {showNavigation && <Navigation />}
    </div>
  )
}

export default App
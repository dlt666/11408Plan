import React from 'react'
import Countdown from './Countdown'
import QuoteDisplay from './QuoteDisplay'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faCalendarCheck, faClock, faBookOpen } from '@fortawesome/free-solid-svg-icons'

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <div className="app-title">
        <h1>沾上11408，这辈子也是直了</h1>
        <div className="title-subtitle">
          <span>科学备考，高效学习</span>
        </div>
      </div>
      
      <div className="home-content">
        <Countdown />
        <QuoteDisplay />
        
        <div className="feature-cards">
          <div className="feature-card">
            <FontAwesomeIcon icon={faBook} size="2x" className="feature-icon" />
            <h3>任务管理</h3>
            <p>创建和管理每日学习任务，跟踪学习进度</p>
          </div>
          <div className="feature-card">
            <FontAwesomeIcon icon={faClock} size="2x" className="feature-icon" />
            <h3>时间统计</h3>
            <p>记录学习时长，提高学习效率</p>
          </div>
          <div className="feature-card">
            <FontAwesomeIcon icon={faCalendarCheck} size="2x" className="feature-icon" />
            <h3>每日打卡</h3>
            <p>养成良好学习习惯，坚持每日打卡</p>
          </div>
          <div className="feature-card">
            <FontAwesomeIcon icon={faBookOpen} size="2x" className="feature-icon" />
            <h3>学习计划</h3>
            <p>制定科学的学习计划，合理分配时间</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
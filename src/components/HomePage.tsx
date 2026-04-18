import React from 'react'
import Countdown from './Countdown'
import QuoteDisplay from './QuoteDisplay'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faCalendarCheck, faClock, faBookOpen, faGraduationCap, faBrain, faLightbulb, faBullseye } from '@fortawesome/free-solid-svg-icons'

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-icon">
            <FontAwesomeIcon icon={faGraduationCap} size="4x" />
          </div>
          <h1 className="hero-title">
            <span className="title-highlight">11408</span>一研为定
          </h1>
          <p className="hero-subtitle">科学备考，高效学习，成就梦想</p>
          <div className="hero-badge">
            <span className="badge-text">2027年考研加油</span>
          </div>
        </div>
      </div>
      
      <div className="home-content">
        <Countdown />
        <QuoteDisplay />
        
        <div className="feature-section">
          <h2 className="section-title">
            <FontAwesomeIcon icon={faLightbulb} className="section-icon" />
            核心功能
          </h2>
          <div className="feature-cards">
            <div className="feature-card">
              <div className="feature-icon-container">
                <FontAwesomeIcon icon={faBook} size="2x" className="feature-icon" />
              </div>
              <h3 className="feature-title">错题集记录</h3>
              <p className="feature-description">记录错题，及时复盘，避免重复错误</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-container">
                <FontAwesomeIcon icon={faBrain} size="2x" className="feature-icon" />
              </div>
              <h3 className="feature-title">学习日志</h3>
              <p className="feature-description">记录学习心得，梳理知识体系</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-container">
                <FontAwesomeIcon icon={faCalendarCheck} size="2x" className="feature-icon" />
              </div>
              <h3 className="feature-title">打卡系统</h3>
              <p className="feature-description">每日打卡，养成良好学习习惯</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-container">
                <FontAwesomeIcon icon={faBullseye} size="2x" className="feature-icon" />
              </div>
              <h3 className="feature-title">学习计划</h3>
              <p className="feature-description">制定科学计划，合理分配时间</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
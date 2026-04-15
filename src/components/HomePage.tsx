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
            <h3>错题集记录</h3>
            <p>记录错题，及时复盘</p>
          </div>
          <div className="feature-card">
            <FontAwesomeIcon icon={faClock} size="2x" className="feature-icon" />
            <h3>发发牢骚唠唠嗑</h3>
            <p>你是否也学疯了！</p>
          </div>
          <div className="feature-card">
            <FontAwesomeIcon icon={faCalendarCheck} size="2x" className="feature-icon" />
            <h3>择校数据记录</h3>
            <p>记录择校数据，方便后续分析</p>
          </div>
          <div className="feature-card">
            <FontAwesomeIcon icon={faBookOpen} size="2x" className="feature-icon" />
            <h3>复试计划与上机考试</h3>
            <p>制定科学的学习计划，合理分配时间</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
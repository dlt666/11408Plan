import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faPlay, faStop, faTimes } from '@fortawesome/free-solid-svg-icons'

interface FullScreenTimerProps {
  isVisible: boolean
  onClose: () => void
  onFinish: (duration: number) => void
  taskName: string
}

const FullScreenTimer: React.FC<FullScreenTimerProps> = ({ isVisible, onClose, onFinish, taskName }) => {
  const [seconds, setSeconds] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isVisible && !isPaused) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isVisible, isPaused])

  const handlePause = () => {
    setIsPaused(!isPaused)
  }

  const handleStop = () => {
    onFinish(seconds)
    setSeconds(0)
    setIsPaused(false)
    onClose()
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!isVisible) return null

  return (
    <div className="full-screen-timer">
      <div className="timer-overlay">
        <div className="timer-content">
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <h2>{taskName}</h2>
          <div className="timer-display">{formatTime(seconds)}</div>
          <div className="timer-controls">
            <button className="control-button" onClick={handlePause}>
              <FontAwesomeIcon icon={isPaused ? faPlay : faPause} />
              {isPaused ? '继续' : '暂停'}
            </button>
            <button className="control-button stop" onClick={handleStop}>
              <FontAwesomeIcon icon={faStop} />
              结束
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FullScreenTimer
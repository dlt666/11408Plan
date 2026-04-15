import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faPlay, faStop, faTimes } from '@fortawesome/free-solid-svg-icons'

interface FullScreenTimerProps {
  isVisible: boolean
  onClose: () => void
  onFinish: (duration: number) => void
  taskName: string
  onPause: (isPaused: boolean) => void
  initialTime: number
}

const FullScreenTimer: React.FC<FullScreenTimerProps> = ({ isVisible, onClose, onFinish, taskName, onPause, initialTime }) => {
  const [seconds, setSeconds] = useState(initialTime)
  const [isPaused, setIsPaused] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(initialTime)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isVisible && !isPaused) {
      const start = Date.now() - (elapsedTime * 1000) // 从之前的时间继续
      startTimeRef.current = start
      
      interval = setInterval(() => {
        if (startTimeRef.current) {
          const currentElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
          setSeconds(currentElapsed)
        }
      }, 1000)
    } else if (isPaused) {
      // 暂停时保存已过时间
      if (startTimeRef.current) {
        const currentElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
        setElapsedTime(elapsedTime + currentElapsed)
        startTimeRef.current = null
      }
    } else if (!isVisible) {
      // 关闭时重置状态
      setSeconds(0)
      setIsPaused(false)
      setElapsedTime(0)
      startTimeRef.current = null
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isVisible, isPaused, elapsedTime])

  const handlePause = () => {
    const newPausedState = !isPaused
    setIsPaused(newPausedState)
    onPause(newPausedState)
  }

  const handleStop = () => {
    onFinish(seconds)
    setSeconds(0)
    setIsPaused(false)
    onClose()
  }

  const handleClose = () => {
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
          <button className="close-button" onClick={handleClose}>
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
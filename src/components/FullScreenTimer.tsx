import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faPlay, faStop, faTimes, faRefresh } from '@fortawesome/free-solid-svg-icons'

interface FullScreenTimerProps {
  isVisible: boolean
  onClose: () => void
  onFinish: (duration: number) => void
  onPause: (isPaused: boolean) => void
  initialTime: number
}

const FullScreenTimer: React.FC<FullScreenTimerProps> = ({ isVisible, onClose, onFinish, onPause, initialTime }) => {
  const [seconds, setSeconds] = useState(initialTime)
  const [isPaused, setIsPaused] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(false)
  const startTimeRef = useRef<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // 当initialTime变化时，更新elapsedTime
  useEffect(() => {
    setElapsedTime(initialTime)
    setSeconds(initialTime)
  }, [initialTime])

  // 计时器核心逻辑
  useEffect(() => {
    if (isVisible && isRunning && !isPaused) {
      // 开始或继续计时
      const start = Date.now() - (elapsedTime * 1000)
      startTimeRef.current = start
      
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const currentElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
          setSeconds(currentElapsed)
        }
      }, 1000)
    } else if (isPaused) {
      // 暂停计时
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (startTimeRef.current) {
        const currentElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
        setElapsedTime(currentElapsed)
        startTimeRef.current = null
      }
    } else if (!isVisible) {
      // 关闭计时器
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (startTimeRef.current) {
        const currentElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
        setElapsedTime(currentElapsed)
        startTimeRef.current = null
      }
      setIsRunning(false)
      setIsPaused(false)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isVisible, isRunning, isPaused, elapsedTime])

  // 当计时器可见时自动开始
  useEffect(() => {
    if (isVisible) {
      setIsRunning(true)
    }
  }, [isVisible])

  const handleStart = () => {
    setIsRunning(true)
    setIsPaused(false)
    onPause(false)
  }

  const handlePause = () => {
    const newPausedState = !isPaused
    setIsPaused(newPausedState)
    onPause(newPausedState)
  }

  const handleReset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setSeconds(initialTime)
    setElapsedTime(initialTime)
    setIsPaused(false)
    setIsRunning(false)
    startTimeRef.current = null
    onPause(true)
  }

  const handleStop = () => {
    onFinish(seconds)
    setSeconds(0)
    setIsPaused(false)
    setIsRunning(false)
    onClose()
  }

  const handleClose = () => {
    // 点击关闭按钮时暂停计时
    if (!isPaused) {
      setIsPaused(true)
      onPause(true)
    }
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
          <h2 style={{ color: 'black' }}>建议点击暂停后再退出计时器</h2>
          <div className="timer-display">{formatTime(seconds)}</div>
          <div className="timer-controls">
            {!isRunning && !isPaused && (
              <button className="control-button start" onClick={handleStart}>
                <FontAwesomeIcon icon={faPlay} />
                开始
              </button>
            )}
            {(isRunning || isPaused) && (
              <button className="control-button pause" onClick={handlePause}>
                <FontAwesomeIcon icon={isPaused ? faPlay : faPause} />
                {isPaused ? '继续' : '暂停'}
              </button>
            )}
            <button className="control-button reset" onClick={handleReset}>
              <FontAwesomeIcon icon={faRefresh} />
              重置
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
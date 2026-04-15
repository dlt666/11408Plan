import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faCalendar } from '@fortawesome/free-solid-svg-icons'

interface CheckinData {
  date: string
  checked: boolean
  tasks: {
    id: string
    subject: string
    duration: number
  }[]
}

interface CheckinCalendarProps {
  onDateSelect?: (date: string) => void
  selectedDate?: string
}

const CheckinCalendar: React.FC<CheckinCalendarProps> = ({ onDateSelect, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [checkins, setCheckins] = useState<CheckinData[]>(() => {
    const savedCheckins = localStorage.getItem('checkins')
    return savedCheckins ? JSON.parse(savedCheckins) : []
  })

  useEffect(() => {
    localStorage.setItem('checkins', JSON.stringify(checkins))
  }, [checkins])

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const formatDate = (day: number, month: number, year: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const isChecked = (date: string) => {
    return checkins.some(checkin => checkin.date === date && checkin.checked)
  }

  const handleDateClick = (date: string) => {
    if (onDateSelect) {
      onDateSelect(date)
    }
  }

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear)
    const days = []

    // 添加上个月的日期
    for (let i = firstDayOfMonth; i > 0; i--) {
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
      const prevMonthDays = getDaysInMonth(prevMonth, prevYear)
      const day = prevMonthDays - i + 1
      const date = formatDate(day, prevMonth, prevYear)
      days.push(
        <div key={`prev-${i}`} className="calendar-day other-month">
          {day}
        </div>
      )
    }

    // 添加当前月的日期
    for (let day = 1; day <= daysInMonth; day++) {
      const date = formatDate(day, currentMonth, currentYear)
      const checked = isChecked(date)
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${checked ? 'checked' : ''} ${selectedDate === date ? 'selected' : ''}`}
          onClick={() => handleDateClick(date)}
        >
          {day}
          {checked && <FontAwesomeIcon icon={faCheckCircle} className="check-icon" />}
        </div>
      )
    }

    // 添加下个月的日期
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear
      days.push(
        <div key={`next-${i}`} className="calendar-day other-month">
          {i}
        </div>
      )
    }

    return days
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

  return (
    <div className="checkin-calendar">
      <div className="calendar-header">
        <button className="month-nav" onClick={handlePrevMonth}>&lt;</button>
        <h3>{currentYear}年 {monthNames[currentMonth]}</h3>
        <button className="month-nav" onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="calendar-weekdays">
        <div className="weekday">日</div>
        <div className="weekday">一</div>
        <div className="weekday">二</div>
        <div className="weekday">三</div>
        <div className="weekday">四</div>
        <div className="weekday">五</div>
        <div className="weekday">六</div>
      </div>
      <div className="calendar-days">
        {generateCalendarDays()}
      </div>
    </div>
  )
}

export default CheckinCalendar
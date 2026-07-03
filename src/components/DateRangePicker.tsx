import React, { useState, useEffect } from 'react'
import styles from './DateRangePicker.module.css'

interface DateRangePickerProps {
  onApply: (start: Date, end: Date) => void
  onClose: () => void
}

export function DateRangePicker({ onApply, onClose }: DateRangePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  // Helper to get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(year, month, day)
    
    if (!startDate || (startDate && endDate)) {
      setStartDate(clickedDate)
      setEndDate(null)
    } else {
      if (clickedDate < startDate) {
        setStartDate(clickedDate)
      } else {
        setEndDate(clickedDate)
      }
    }
  }

  const handleClear = () => {
    setStartDate(null)
    setEndDate(null)
  }

  const handleApply = () => {
    if (startDate && endDate) {
      onApply(startDate, endDate)
    } else if (startDate) {
      // If they only clicked one date, treat it as a 1-day range
      onApply(startDate, startDate)
    }
  }

  const isSelected = (day: number) => {
    const d = new Date(year, month, day).getTime()
    return (startDate && d === startDate.getTime()) || (endDate && d === endDate.getTime())
  }

  const isInRange = (day: number) => {
    if (!startDate || !endDate) return false
    const d = new Date(year, month, day).getTime()
    return d > startDate.getTime() && d < endDate.getTime()
  }

  const isRangeStart = (day: number) => {
    if (!startDate || !endDate) return false
    const d = new Date(year, month, day).getTime()
    return d === startDate.getTime()
  }

  const isRangeEnd = (day: number) => {
    if (!startDate || !endDate) return false
    const d = new Date(year, month, day).getTime()
    return d === endDate.getTime()
  }

  const formatDateDisplay = () => {
    if (!startDate) return 'Select Date Range'
    
    const formatStr = (d: Date) => {
      const dd = d.getDate().toString().padStart(2, '0')
      const mmm = months[d.getMonth()].substring(0, 3)
      const yyyy = d.getFullYear()
      return `${dd} ${mmm} ${yyyy}`
    }

    if (startDate && !endDate) return formatStr(startDate)
    if (startDate && endDate) {
      if (startDate.getTime() === endDate.getTime()) return formatStr(startDate)
      return `${formatStr(startDate)} - ${formatStr(endDate)}`
    }
    return ''
  }

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Select Date Range</div>
        <button className={styles.navButton} onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className={styles.headerRow}>
        <button className={styles.navButton} onClick={handlePrevMonth}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div className={styles.monthYearSelectors}>
          <select 
            className={styles.select} 
            value={month} 
            onChange={(e) => setCurrentMonth(new Date(year, parseInt(e.target.value), 1))}
          >
            {months.map((m, idx) => (
              <option key={m} value={idx}>{m}</option>
            ))}
          </select>
          <select 
            className={styles.select} 
            value={year}
            onChange={(e) => setCurrentMonth(new Date(parseInt(e.target.value), month, 1))}
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <button className={styles.navButton} onClick={handleNextMonth}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <div className={styles.weekDays}>
        {weekDays.map(d => (
          <div key={d} className={styles.weekDay}>{d}</div>
        ))}
      </div>

      <div className={styles.daysGrid}>
        {/* Empty slots for days before first day of month */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className={styles.dayCell} />
        ))}
        
        {/* Actual days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const selected = isSelected(day)
          const inRange = isInRange(day)
          const rangeStart = isRangeStart(day)
          const rangeEnd = isRangeEnd(day)
          
          return (
            <div 
              key={day} 
              className={`${styles.dayCell} ${inRange ? styles.inRange : ''} ${rangeStart ? styles.rangeStart : ''} ${rangeEnd ? styles.rangeEnd : ''}`}
            >
              <button 
                className={`${styles.dayButton} ${selected ? styles.selected : ''}`}
                onClick={() => handleDayClick(day)}
              >
                {day.toString().padStart(2, '0')}
              </button>
            </div>
          )
        })}
      </div>

      <div className={styles.footer}>
        <div className={styles.dateDisplay}>
          {formatDateDisplay()}
        </div>
        <div className={styles.actions}>
          <button className={styles.clearBtn} onClick={handleClear}>Clear</button>
          <button 
            className={styles.applyBtn} 
            onClick={handleApply}
            disabled={!startDate}
            style={{ opacity: !startDate ? 0.5 : 1 }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

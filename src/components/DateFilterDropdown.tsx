import React, { useState, useEffect, useRef } from 'react'
import { DateRangePicker } from './DateRangePicker'
import styles from './DateFilterDropdown.module.css'

const FILTER_OPTIONS = ['Today', 'Last 7 days', 'Last 30 days', 'Last 3 months', 'Custom Range']

interface DateFilterDropdownProps {
  dateFilterValue: string
  onDateFilterChange: (value: string, range?: { start: Date | null, end: Date | null }) => void
}

const CheckIcon = () => (
  <svg
    className={styles.dropdownCheckIcon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export function DateFilterDropdown({ dateFilterValue, onDateFilterChange }: DateFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setShowDatePicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectDateFilter = (value: string) => {
    if (value === 'Custom Range') {
      setShowDatePicker(true)
    } else {
      if (dateFilterValue === value) {
        onDateFilterChange('')
      } else {
        onDateFilterChange(value)
      }
      setIsOpen(false)
      setShowDatePicker(false)
    }
  }

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <button
        className={`${styles.filterDropdown} ${dateFilterValue ? styles.filterDropdownActive : ''}`}
        aria-haspopup="listbox"
        onClick={() => {
          setIsOpen(!isOpen)
          if (isOpen) setShowDatePicker(false)
        }}
      >
        <span>{dateFilterValue || 'Select Date'}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.chevronIcon}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {isOpen && (
        <div className={styles.dropdownPopover} style={showDatePicker ? { padding: 0, border: 'none', background: 'transparent' } : {}}>
          {showDatePicker ? (
            <DateRangePicker 
              onApply={(start, end) => {
                onDateFilterChange('Custom Range', { start, end })
                setIsOpen(false)
                setShowDatePicker(false)
              }}
              onClose={() => {
                setShowDatePicker(false)
              }}
            />
          ) : (
            FILTER_OPTIONS.map((option) => (
              <button
                key={option}
                className={styles.dropdownOption}
                onClick={() => selectDateFilter(option)}
              >
                <span>{option}</span>
                {dateFilterValue === option && <CheckIcon />}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

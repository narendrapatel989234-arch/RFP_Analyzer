'use client'

import React, { useState } from 'react'
import styles from './PortfolioStats.module.css'

interface PortfolioStatsProps {
  allRequests: number
  functionalPending: number
  technicalPending: number
  completed: number
}

const chartData = [
  { week: 'Week 1', count: 30, x: 0, y: 70 },
  { week: 'Week 2', count: 35, x: 40, y: 65 },
  { week: 'Week 3', count: 55, x: 80, y: 45 },
  { week: 'Week 4', count: 50, x: 120, y: 50 },
  { week: 'Week 5', count: 75, x: 160, y: 25 },
  { week: 'Week 6', count: 60, x: 200, y: 40 },
  { week: 'Week 7', count: 85, x: 240, y: 15 },
  { week: 'Week 8', count: 70, x: 280, y: 30 },
  { week: 'Week 9', count: 90, x: 320, y: 10 },
  { week: 'Week 10', count: 75, x: 360, y: 25 },
  { week: 'Week 11', count: 95, x: 400, y: 5 },
]

export function PortfolioStats({ allRequests, functionalPending, technicalPending, completed }: PortfolioStatsProps) {
  const [hoverData, setHoverData] = useState<{week: string, count: number, x: number, y: number} | null>(null)

  const handleMouseMove = (e: React.MouseEvent, week: string, count: number) => {
    setHoverData({
      week,
      count,
      x: e.clientX,
      y: e.clientY
    })
  }

  const handleMouseLeave = () => {
    setHoverData(null)
  }

  return (
    <div className={styles.statsCard}>
      <div className={styles.topSection}>
        <div className={styles.titleArea}>
          <div className={styles.titleLine}>
            <span className={styles.titleText}>Statistics</span>
          </div>
          <div className={styles.totalArea}>
            <span className={styles.totalLabel}>All Requests</span>
            <span className={styles.largeCount}>{allRequests.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div className={styles.chartAreaFull}>
        <svg viewBox="0 0 400 100" preserveAspectRatio="none" className={styles.areaChart} onMouseLeave={handleMouseLeave}>
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--Lavender-500, #A09DED)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="var(--Lavender-500, #A09DED)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path 
            d="M0,100 L0,70 L40,65 L80,45 L120,50 L160,25 L200,40 L240,15 L280,30 L320,10 L360,25 L400,5 L400,100 Z" 
            fill="url(#areaGradient)" 
            style={{ pointerEvents: 'none' }}
          />
          <path 
            d="M0,70 L40,65 L80,45 L120,50 L160,25 L200,40 L240,15 L280,30 L320,10 L360,25 L400,5" 
            fill="none" 
            stroke="var(--Lavender-600, #7673E0)" 
            strokeWidth="1.5" 
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pointerEvents: 'none' }}
          />
          
          {chartData.map((point, i) => (
            <rect
              key={i}
              x={point.x - 20}
              y={0}
              width={40}
              height={100}
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onMouseMove={(e) => handleMouseMove(e, point.week, point.count)}
            />
          ))}
        </svg>
      </div>

      {hoverData && (
        <div className={styles.floatingTooltip} style={{ left: hoverData.x + 15, top: hoverData.y - 30 }}>
          <span className={styles.tooltipLabel}>{hoverData.week}</span>
          <span className={styles.tooltipValue}>{hoverData.count} requests</span>
        </div>
      )}

      <div className={styles.bottomSection}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Functional Pending</span>
          <span className={styles.metricValue}>{functionalPending}</span>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Technical Pending</span>
          <span className={styles.metricValue}>{technicalPending}</span>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Completed Requests</span>
          <span className={styles.metricValue}>{completed}</span>
        </div>
      </div>
    </div>
  )
}


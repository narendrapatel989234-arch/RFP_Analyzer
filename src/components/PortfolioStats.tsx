'use client'

import React, { useState } from 'react'
import styles from './PortfolioStats.module.css'

interface PortfolioStatsProps {
  allRequests: number
  functionalPending: number
  technicalPending: number
  completed: number
}

export function PortfolioStats({ allRequests, functionalPending, technicalPending, completed }: PortfolioStatsProps) {
  const [hoverData, setHoverData] = useState<{label: string, value: number, x: number, y: number} | null>(null)

  const handleMouseMove = (e: React.MouseEvent, label: string, value: number) => {
    // Get relative mouse position within the chartWrapper
    const rect = e.currentTarget.getBoundingClientRect()
    // It's usually better to position tooltip relative to viewport and use fixed positioning, but since chartWrapper is small, 
    // let's use clientX/clientY relative to viewport.
    setHoverData({
      label,
      value,
      x: e.clientX,
      y: e.clientY
    })
  }

  const handleMouseLeave = () => {
    setHoverData(null)
  }

  const completedPct = (completed / allRequests) * 100 || 0;
  const functionalPct = (functionalPending / allRequests) * 100 || 0;
  const technicalPct = (technicalPending / allRequests) * 100 || 0;

  // CSS rotates SVG -90deg so 0 is top
  const completedDashArray = `${completedPct} ${100 - completedPct}`;
  const completedDashOffset = 0;
  
  const functionalDashArray = `${functionalPct} ${100 - functionalPct}`;
  const functionalDashOffset = 100 - completedPct;
  
  const technicalDashArray = `${technicalPct} ${100 - technicalPct}`;
  const technicalDashOffset = 100 - (completedPct + functionalPct);

  return (
    <div className={styles.statsCard}>
      <div className={styles.topSection}>
        <div className={styles.titleArea}>
          <div className={styles.titleLine}>
            <span className={styles.titleText}>Statistics</span>
          </div>
          <span className={styles.largeCount}>{allRequests.toLocaleString()}</span>
          <span className={styles.subtext}>All Requests</span>
        </div>
        <div className={styles.chartArea}>
          <div className={styles.chartWrapper}>
            <svg viewBox="0 0 42 42" className={styles.donutChart}>
              <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#e5e7eb" strokeWidth="6"></circle>
              
              <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#374151" strokeWidth="6" strokeDasharray={completedDashArray} strokeDashoffset={completedDashOffset}
                onMouseMove={(e) => handleMouseMove(e, 'Completed', completed)} onMouseLeave={handleMouseLeave} style={{cursor: 'pointer'}}></circle>
                
              <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#9ca3af" strokeWidth="6" strokeDasharray={functionalDashArray} strokeDashoffset={functionalDashOffset}
                onMouseMove={(e) => handleMouseMove(e, 'Functional', functionalPending)} onMouseLeave={handleMouseLeave} style={{cursor: 'pointer'}}></circle>
                
              <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#4b5563" strokeWidth="6" strokeDasharray={technicalDashArray} strokeDashoffset={technicalDashOffset}
                onMouseMove={(e) => handleMouseMove(e, 'Technical', technicalPending)} onMouseLeave={handleMouseLeave} style={{cursor: 'pointer'}}></circle>
            </svg>
          </div>
        </div>
      </div>
      
      {hoverData && (
        <div className={styles.floatingTooltip} style={{ left: hoverData.x + 15, top: hoverData.y + 15 }}>
          <span className={styles.tooltipLabel}>{hoverData.label}</span>
          <span className={styles.tooltipValue}>{hoverData.value}</span>
        </div>
      )}

      <div className={styles.bottomSection}>
        <div className={styles.metricCard}>
          <span className={styles.cardDot} style={{ backgroundColor: '#9ca3af' }}></span>
          <span className={styles.metricLabel}>Functional<br/>Pending</span>
          <span className={styles.metricValue}>{functionalPending}</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.cardDot} style={{ backgroundColor: '#4b5563' }}></span>
          <span className={styles.metricLabel}>Technical<br/>Pending</span>
          <span className={styles.metricValue}>{technicalPending}</span>
        </div>
        <div className={`${styles.metricCard} ${styles.metricCardHighlighted}`}>
          <span className={styles.cardDot} style={{ backgroundColor: '#374151' }}></span>
          <span className={styles.metricLabel}>Completed<br/>Requests</span>
          <span className={styles.metricValue}>{completed}</span>
        </div>
      </div>
    </div>
  )
}

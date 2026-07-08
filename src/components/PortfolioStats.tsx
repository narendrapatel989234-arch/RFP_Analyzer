import React from 'react'
import styles from './PortfolioStats.module.css'

interface PortfolioStatsProps {
  allRequests: number
  inProgress: number
  approved: number
}

export function PortfolioStats({ allRequests, inProgress, approved }: PortfolioStatsProps) {
  return (
    <div className={styles.statsCard}>
      <div className={styles.chartContainer}>
        {/* A simple SVG curve mimicking a trend line */}
        <svg viewBox="0 0 400 100" preserveAspectRatio="none" className={styles.trendLine}>
          <defs>
            <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7a9aff" stopOpacity="1" />
              <stop offset="100%" stopColor="#e0e8ff" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <rect x="20" y="60" width="24" height="40" rx="4" fill="url(#barGrad)" />
          <rect x="60" y="40" width="24" height="60" rx="4" fill="url(#barGrad)" />
          <rect x="100" y="50" width="24" height="50" rx="4" fill="url(#barGrad)" />
          <rect x="140" y="20" width="24" height="80" rx="4" fill="url(#barGrad)" />
          <rect x="180" y="70" width="24" height="30" rx="4" fill="url(#barGrad)" />
          <rect x="220" y="45" width="24" height="55" rx="4" fill="url(#barGrad)" />
          <rect x="260" y="10" width="24" height="90" rx="4" fill="url(#barGrad)" />
          <rect x="300" y="30" width="24" height="70" rx="4" fill="url(#barGrad)" />
          <rect x="340" y="55" width="24" height="45" rx="4" fill="url(#barGrad)" />
        </svg>
      </div>
      
      <div className={styles.metricsContainer}>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>All Requests</span>
          <span className={styles.metricValue}>{allRequests}</span>
        </div>
        <div className={styles.metricDivider} />
        <div className={styles.metric}>
          <span className={styles.metricLabel}>In Progress</span>
          <span className={styles.metricValue}>{inProgress}</span>
        </div>
        <div className={styles.metricDivider} />
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Approved</span>
          <span className={styles.metricValue}>{approved}</span>
        </div>
      </div>
    </div>
  )
}

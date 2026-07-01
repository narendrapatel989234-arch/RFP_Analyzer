import React from 'react'
import styles from './StatCard.module.css'

interface StatCardProps {
  title: string
  count: number
  trend?: { value: number; direction: 'up' | 'down' }
  trendColor?: string
  accentColor?: string
  icon: React.ReactNode
}

export function StatCard({ title, count, trend, icon }: StatCardProps) {
  let iconBgColor = 'transparent';
  let iconColor = 'currentColor';

  if (title === 'Total RFPs Uploaded') {
    iconBgColor = 'var(--action-ai-bg-soft)';
    iconColor = 'var(--action-ai-bg-default)';
  } else if (title === 'Functional Pending') {
    iconBgColor = 'var(--status-warning-bg)';
    iconColor = 'var(--status-warning-icon)';
  } else if (title === 'Technical Pending') {
    iconBgColor = 'var(--status-info-bg)';
    iconColor = 'var(--status-info-icon)';
  } else if (title === 'Completed') {
    iconBgColor = 'var(--status-success-bg)';
    iconColor = 'var(--status-success-icon)';
  }

  return (
    <div className={styles.card}>
      <div className={styles.row1}>
        <h3 className={styles.title}>{title}</h3>
        <div 
          className={styles.iconContainer}
          style={{ backgroundColor: iconBgColor, color: iconColor }}
        >
          {icon}
        </div>
      </div>
      <div className={styles.row2}>
        <div className={styles.count}>{count}</div>
      </div>
      {trend && (
        <div className={styles.trendRow}>
          <div className={`${styles.trendPill} ${trend.direction === 'up' ? styles.trendUp : styles.trendDown}`}>
            <span>{trend.direction === 'up' ? '↑' : '↓'}</span>
            <span>{trend.value}%</span>
          </div>
          <span className={styles.trendText}>vs last month</span>
        </div>
      )}
    </div>
  )
}

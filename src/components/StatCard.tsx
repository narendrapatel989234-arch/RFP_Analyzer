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

export function StatCard({ title, count, trend, trendColor, accentColor, icon }: StatCardProps) {
  const iconColor = accentColor || 'var(--text-secondary)'
  const iconBgColor = accentColor
    ? `color-mix(in srgb, ${accentColor} 14%, transparent)`
    : 'var(--bg-surface-2)'

  const defaultTrendColor = trend?.direction === 'up' ? 'var(--status-success-text)' : 'var(--status-error-text)'
  const resolvedTrendColor = trendColor || defaultTrendColor
  const trendBgColor = trendColor
    ? `color-mix(in srgb, ${trendColor} 14%, transparent)`
    : trend?.direction === 'up'
      ? 'var(--status-success-bg)'
      : 'var(--status-error-bg)'

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
          <div className={styles.trendPill} style={{ color: resolvedTrendColor, backgroundColor: trendBgColor }}>
            <span>{trend.direction === 'up' ? '↑' : '↓'}</span>
            <span>{trend.value}%</span>
          </div>
          <span className={styles.trendText}>vs last month</span>
        </div>
      )}
    </div>
  )
}

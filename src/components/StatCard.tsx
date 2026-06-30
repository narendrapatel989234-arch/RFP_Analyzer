import React from 'react'
import styles from './StatCard.module.css'

interface StatCardProps {
  title: string
  count: number
  trend: string
  trendColor?: string
  accentColor: string
  icon: React.ReactNode
}

export function StatCard({
  title,
  count,
  trend,
  trendColor = 'var(--text-secondary)',
  accentColor,
  icon,
}: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.accentBar} style={{ backgroundColor: accentColor }} />
      <div className={styles.header}>
        <span className={styles.icon}>{icon}</span>
        <h3 className={styles.title}>{title}</h3>
      </div>
      <div className={styles.count}>{count}</div>
      <div className={styles.trend} style={{ color: trendColor }}>
        {trend}
      </div>
    </div>
  )
}

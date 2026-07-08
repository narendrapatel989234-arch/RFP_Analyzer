import React from 'react'
import styles from './InsightsSection.module.css'

export function InsightsSection() {
  return (
    <div className={styles.insightsCard}>
      <h3 className={styles.title}>Insights</h3>
      <div className={styles.content}>
        <div className={styles.placeholderBlock} />
        <div className={styles.placeholderBlock} />
        <div className={styles.placeholderBlock} />
      </div>
    </div>
  )
}

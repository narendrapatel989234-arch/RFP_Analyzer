import React from 'react'
import styles from './InsightsSection.module.css'

export function InsightsSection() {
  return (
    <div className={styles.insightsCard}>
      <div className={styles.topSection}>
        <div className={styles.titleArea}>
          <div className={styles.titleLine}>
            <span className={styles.titleText}>Insights</span>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280', fontSize: '18px', fontWeight: 600 }}>
        Coming Soon
      </div>
    </div>
  )
}

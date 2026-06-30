import React from 'react'
import styles from './TopNav.module.css'

export function TopNav() {
  return (
    <header className={styles.topnav}>
      <div className={styles.left}>
        <div className={styles.logoMark} />
        <span className={styles.companyName}>Inception42</span>
      </div>

      <div className={styles.center}>
        <h1 className={styles.appName}>RFP Responder</h1>
      </div>

      <div className={styles.right}>
        <button className={styles.iconBtn} aria-label="Toggle theme">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </button>
        <button className={styles.iconBtn} aria-label="Notifications">
          <div className={styles.badge} />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </button>
        <button className={styles.iconBtn} aria-label="User profile">
          <div className={styles.avatar}>N</div>
        </button>
      </div>
    </header>
  )
}

'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FolderKanban, CheckSquare, FileText, Settings, Sliders, User } from 'lucide-react'
import styles from './LeftNav.module.css'

export function LeftNav() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', path: '/dashboard-v2', icon: <LayoutDashboard size={20} /> },
    { name: 'My Requests', path: '#', icon: <FolderKanban size={20} /> },
    { name: 'Approvals', path: '#', icon: <CheckSquare size={20} /> },
    { name: 'Documents', path: '#', icon: <FileText size={20} /> },
    { name: 'Settings', path: '#', icon: <Settings size={20} /> },
    { name: 'Configuration', path: '#', icon: <Sliders size={20} /> },
  ]

  return (
    <nav className={styles.leftNav}>
      <div className={styles.topSection}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/app-icon.png"
            alt="App Logo"
            width={40}
            height={40}
            className={styles.logoIcon}
          />
        </Link>
        <div className={styles.navItems}>
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.path} 
              className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}
            >
              <div className={styles.iconWrapper}>
                {item.icon}
              </div>
              <span className={styles.tooltip}>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
      
      <div className={styles.bottomSection}>
        <div className={styles.profileItem}>
          <div className={styles.profileAvatar}>
            <img src="https://i.pravatar.cc/150?img=11" alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          </div>
          <span className={styles.profileName}>Alex M.</span>
          <span className={styles.tooltip}>Profile</span>
        </div>
      </div>
    </nav>
  )
}

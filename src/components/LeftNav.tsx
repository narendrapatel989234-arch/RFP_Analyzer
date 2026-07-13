'use client'

import React, { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FolderKanban, CheckSquare, FileText, Settings, Sliders, User } from 'lucide-react'
import styles from './LeftNav.module.css'

let lastIndicatorPosition: number | null = null;

export function LeftNav() {
  const pathname = usePathname()
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([])

  const navItems = [
    { name: 'Dashboard', path: '/dashboard-v2', icon: <LayoutDashboard size={20} /> },
    { name: 'My Requests', path: '/my-requests', icon: <FolderKanban size={20} /> },
    { name: 'Approvals', path: '#', icon: <CheckSquare size={20} /> },
    { name: 'Documents', path: '#', icon: <FileText size={20} /> },
    { name: 'Settings', path: '#', icon: <Settings size={20} /> },
    { name: 'Configuration', path: '#', icon: <Sliders size={20} /> },
  ]

  const activeIndex = navItems.findIndex(item => {
    if (item.name === 'Dashboard') {
      return pathname === '/dashboard-v2' || 
             pathname.startsWith('/rfp-v2') || 
             pathname.startsWith('/solution-strategy-v2') || 
             pathname.startsWith('/know-your-client-v2')
    }
    return pathname === item.path
  })

  const [indicatorStyle, setIndicatorStyle] = useState(() => {
    // If it's a fresh load, guess the position based on index (64px per item: 40px height + 24px gap)
    const initialPos = lastIndicatorPosition !== null ? lastIndicatorPosition : (activeIndex !== -1 ? activeIndex * 64 : 0);
    return {
      transform: `translateY(${initialPos}px)`,
      opacity: lastIndicatorPosition !== null ? 1 : 0
    }
  })

  useEffect(() => {
    if (activeIndex !== -1 && navRefs.current[activeIndex]) {
      const el = navRefs.current[activeIndex]
      if (el) {
        // Use a small timeout to ensure the DOM paints the initial state before transitioning
        setTimeout(() => {
          setIndicatorStyle({
            transform: `translateY(${el.offsetTop}px)`,
            opacity: 1
          })
          lastIndicatorPosition = el.offsetTop
        }, 10)
      }
    } else {
      setIndicatorStyle(prev => ({ ...prev, opacity: 0 }))
    }
  }, [activeIndex, pathname])

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
          <div className={styles.activeIndicator} style={indicatorStyle} />
          {navItems.map((item, index) => {
            const isActive = activeIndex === index;
            
            return (
            <Link 
              key={item.name} 
              href={item.path} 
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              ref={(el) => {
                navRefs.current[index] = el;
              }}
            >
              <div className={styles.iconWrapper}>
                {item.icon}
              </div>
              <span className={styles.tooltip}>{item.name}</span>
            </Link>
            )
          })}
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

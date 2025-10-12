// src/components/Header.js
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="header">
      <div className="logo">
        <i className="fas fa-shield-alt"></i>
        <span>CodeGuard</span>
      </div>
      <nav className="nav">
        <Link 
          href="/" 
          className={`nav-link ${pathname === '/' ? 'active' : ''}`}
        >
          Home
        </Link>
        <Link 
          href="/manage" 
          className={`nav-link ${pathname === '/manage' ? 'active' : ''}`}
        >
          Manage Files
        </Link>
        <Link 
          href="/statistics" 
          className={`nav-link ${pathname === '/statistics' ? 'active' : ''}`}
        >
          Statistics
        </Link>
      </nav>
    </header>
  )
}

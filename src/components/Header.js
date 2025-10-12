// src/components/Header.js
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const pathname = usePathname()
  const { user, logout, isAuthenticated } = useAuth()

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
        {isAuthenticated && (
          <>
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
          </>
        )}
      </nav>
      <div className="user-menu">
        {isAuthenticated ? (
          <div className="user-info">
            <div className="user-avatar">
              <i className="fas fa-user"></i>
            </div>
            <div className="user-details">
              <span className="user-name">{user?.full_name}</span>
              <span className="user-email">{user?.email}</span>
            </div>
            <button onClick={logout} className="logout-btn">
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-links">
            <Link href="/login" className="login-link">
              <i className="fas fa-sign-in-alt"></i>
              Login
            </Link>
            <Link href="/register" className="register-link">
              <i className="fas fa-user-plus"></i>
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}

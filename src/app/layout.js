'use client'

import { Poppins } from 'next/font/google'
import './globals.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { AuthProvider } from '@/contexts/AuthContext'

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <AuthProvider>
          {/* Animated Background */}
          <div className="animated-background">
            <div className="circle circle1"></div>
            <div className="circle circle2"></div>
            <div className="circle circle3"></div>
          </div>

          {children}

          {/* Footer */}
          <footer className="footer">
            <p>© 2025 CodeGuard - Powered by Machine Learning | Built with ❤️ for Academic Integrity</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}

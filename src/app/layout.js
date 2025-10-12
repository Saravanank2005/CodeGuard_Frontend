import { Poppins } from 'next/font/google'
import './globals.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Python Plagiarism Checker - AI-Powered Detection',
  description: 'Advanced machine learning algorithms to detect code similarity and plagiarism with 95%+ accuracy',
  keywords: 'plagiarism, code detection, machine learning, python, AI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
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
      </body>
    </html>
  )
}

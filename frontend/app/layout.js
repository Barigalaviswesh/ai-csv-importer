import './globals.css'
import DarkModeToggle from './DarkModeToggle'

export const metadata = {
  title: 'AI CSV Importer - GrowEasy CRM',
  description: 'Intelligent CSV import system for GrowEasy CRM',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DarkModeToggle />
        {children}
      </body>
    </html>
  )
}

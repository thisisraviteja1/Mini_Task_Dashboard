import './globals.css'

export const metadata = {
  title: 'TaskFlow — Task Management Dashboard',
  description: 'A clean and powerful task management dashboard to organize your work.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

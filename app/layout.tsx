import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '仿流光卡片',
  description: '展示各种美丽的渐变色组合',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  )
} 
import type { Metadata } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { IntroProvider } from '@/components/intro-context'
import { LayoutGroup } from 'framer-motion'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: '--font-heading',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Johann Cherian Ajish | Computer Science Engineering Student',
  description: 'Personal portfolio of Johann Cherian Ajish - Computer Science Engineering student passionate about cybersecurity, software development, reverse engineering, and problem solving.',
  keywords: ['Johann Cherian Ajish', 'Computer Science', 'Cybersecurity', 'Software Developer', 'Portfolio'],
  authors: [{ name: 'Johann Cherian Ajish' }],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport = {
  themeColor: '#030303',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}>
        <IntroProvider>
          <LayoutGroup>
            {/* Global Background Layers */}
            <div className="fixed inset-0 z-[-1] bg-background">
              <div className="absolute inset-0 bg-engineering-grid" />
              <div className="absolute inset-0 bg-noise" />
              <div className="absolute inset-0 bg-vignette" />
            </div>
            
            <div className="relative z-0">
              {children}
            </div>
          </LayoutGroup>
        </IntroProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

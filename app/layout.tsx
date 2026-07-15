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
  title: 'CH3RI4N',
  description: 'Building secure systems with intelligence.',
  openGraph: {
    title: 'CH3RI4N',
    description: 'Building secure systems with intelligence.',
    images: ['/placeholder-og.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CH3RI4N',
    description: 'Building secure systems with intelligence.',
    images: ['/placeholder-og.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' }
    ],
    apple: '/apple-icon.png',
    shortcut: '/favicon.ico'
  }
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

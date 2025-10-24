import type { Metadata } from "next"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { AuthProvider } from "@/lib/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import { PerformanceOptimizer } from "@/components/performance-optimizer"
import { ErrorBoundary } from "@/components/error-boundary"
import { Navbar } from "@/components/navbar"
import Footer from "@/components/footer"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "ProPath - AI-Powered Career Intelligence",
  description: "Transform your career with AI-powered resume analysis, skill gap assessment, and personalized learning paths.",
  keywords: ["career", "resume", "AI", "job search", "skills", "learning"],
  authors: [{ name: "ProPath Team" }],
  creator: "ProPath",
  publisher: "ProPath",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://propath.app"),
  openGraph: {
    title: "ProPath - AI-Powered Career Intelligence",
    description: "Transform your career with AI-powered resume analysis, skill gap assessment, and personalized learning paths.",
    url: "https://propath.app",
    siteName: "ProPath",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ProPath - AI-Powered Career Intelligence",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProPath - AI-Powered Career Intelligence",
    description: "Transform your career with AI-powered resume analysis, skill gap assessment, and personalized learning paths.",
    images: ["/og-image.png"],
    creator: "@propath",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased min-h-screen bg-background font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ErrorBoundary>
              <PerformanceOptimizer>
                <Navbar />
                {children}
                <Toaster 
                  position="top-right"
                  richColors
                  closeButton
                />
                
               <Footer />
              </PerformanceOptimizer>
            </ErrorBoundary>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "The Blog - A Web Personal Blog & Community",
  description: "A modern blog platform for sharing thoughts, ideas, and stories with the community.",
  keywords: ["blog", "personal blog", "community", "stories", "ideas"],
  authors: [{ name: "Blog Author" }],
  openGraph: {
    title: "The Blog - A Web Personal Blog & Community",
    description: "A modern blog platform for sharing thoughts, ideas, and stories with the community.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Blog - A Web Personal Blog & Community",
    description: "A modern blog platform for sharing thoughts, ideas, and stories with the community.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

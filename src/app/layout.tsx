import type { Metadata } from 'next'
import '@/styles/globals.css'
import Link from 'next/link'
import { ReactNode, Suspense } from 'react'
import { Spinner } from '@/shared/ui/Spinner'
import StoreProvider from '@/providers/StoreProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'

export const metadata: Metadata = {
  title: 'Pet-Meme Studio',
  description: 'Создавайте и делитесь забавными мемами с питомцами',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <StoreProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <header className="bg-background border-b">
              <div className="flex justify-between items-center max-w-[1200px] w-full mx-auto py-3">
                <Link href="/" className="flex items-center gap-2">
                  <span className="text-2xl">🐾</span>
                  <h1 className="font-bold text-xl">Pet-Meme Studio</h1>
                </Link>
                <nav className="flex gap-4">
                  <Link
                    href="/gallery"
                    className="hover:text-primary transition-colors font-medium"
                  >
                    Галерея (SSG)
                  </Link>
                  <Link href="/editor" className="hover:text-primary transition-colors font-medium">
                    Редактор (CSR)
                  </Link>
                  <Link
                    href="/my-memes"
                    className="hover:text-primary transition-colors font-medium"
                  >
                    Мои мемы (SSR)
                  </Link>
                  <Link href="/about" className="hover:text-primary transition-colors font-medium">
                    О проекте (ISR)
                  </Link>
                </nav>
              </div>
            </header>

            <main className="flex-1 max-w-[1200px] w-full mx-auto">
              <Suspense fallback={<Spinner />}>{children}</Suspense>
            </main>

            <footer className="border-t py-6 text-center text-sm text-muted-foreground">
              <div className="max-w-[1200px] mx-auto px-4">
                © 2025 Pet-Meme Studio - Создавайте мемы с любовью к питомцам
              </div>
            </footer>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  )
}

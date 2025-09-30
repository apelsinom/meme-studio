import type { Metadata } from 'next'
import '@/styles/globals.css'
import Link from 'next/link'
import { ReactNode, Suspense } from 'react'
import { Spinner } from '@/shared/ui/Spinner'
import StoreProvider from '@/providers/StoreProvider'

export const metadata: Metadata = {
  title: 'Meme Studio',
  description: 'Тестовое задание',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen flex flex-col">
        <header className="bg-gray-900 text-white ">
          <div className="flex justify-between items-center max-w-[1120px] w-full mx-auto ">
            <h1 className="font-bold">🐾 Pet-Meme Studio</h1>
            <nav className="p-4 flex justify-center gap-4">
              <Link href="/gallery" className="hover:underline">
                Галерея (SSG)
              </Link>
              <Link href="/editor" className="hover:underline">
                Редактор (CSR)
              </Link>
              <Link href="/my-memes" className="hover:underline">
                Мои мемы (SSR)
              </Link>
              <Link href="/about" className="hover:underline">
                О проекте (ISR)
              </Link>
            </nav>
          </div>
        </header>
        <StoreProvider>
          <main className="p-6 flex-1 max-w-[1120px] w-full mx-auto">
            <Suspense fallback={<Spinner />}>{children}</Suspense>
          </main>
        </StoreProvider>
        <footer className="border-t p-4 text-center text-sm text-muted-foreground">
          © 2025 Pet-Meme Studio
        </footer>
      </body>
    </html>
  )
}

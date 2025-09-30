'use client'

import { Provider } from 'react-redux'
import { ReactNode } from 'react'
import { store } from '@/store'

export default function StoreProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>
}

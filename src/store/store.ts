import { configureStore } from '@reduxjs/toolkit'
import { memesApi } from './memeApi'

export const store = configureStore({
  reducer: {
    [memesApi.reducerPath]: memesApi.reducer,
  },
  middleware: getDefault => getDefault().concat(memesApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

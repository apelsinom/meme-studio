import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { PixabayDTO, TMeme } from '@/shared/types/types'

export const memesApi = createApi({
  reducerPath: 'memesApi',
  baseQuery: fetchBaseQuery({
    baseUrl:
      typeof window === 'undefined'
        ? process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000/api'
        : '/api',
  }),
  tagTypes: ['Memes'],
  endpoints: builder => ({
    getMemes: builder.query<PixabayDTO, { q?: string; page?: number }>({
      query: ({ q = 'cats', page = 1 }) => `/memes?q=${q}&page=${page}`,
    }),

    getLocalMemes: builder.query<TMeme[], void>({
      query: () => '/memes?local=true',
      providesTags: ['Memes'],
    }),

    // теперь addMeme принимает полный объект TMeme
    addMeme: builder.mutation<TMeme, TMeme>({
      query: meme => ({
        url: '/memes',
        method: 'POST',
        body: meme,
      }),
      invalidatesTags: ['Memes'],
    }),

    deleteMeme: builder.mutation<{ success: boolean; message: string; deletedId: string }, string>({
      query: id => ({
        url: `/memes?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Memes'],
    }),
  }),
})

export const {
  useGetMemesQuery,
  useGetLocalMemesQuery,
  useAddMemeMutation,
  useDeleteMemeMutation,
} = memesApi

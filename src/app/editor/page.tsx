'use client'

import { useForm } from 'react-hook-form'
import { useAddMemeMutation } from '@/store/memeApi'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { MemeFormData, memeFormSchema } from '@/shared/types/memeFormSchema'
import { TMeme } from '@/shared/types/types'

export default function EditorPage() {
  const [addMeme, { isLoading: isSaving }] = useAddMemeMutation()
  const photo = useSearchParams().get('src')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    resetField,
  } = useForm<MemeFormData>({
    resolver: zodResolver(memeFormSchema),
    defaultValues: {
      title: '',
      description: '',
      imageUrl: null,
      imageFile: null,
    },
  })

  useEffect(() => {
    if (photo) {
      setValue('imageUrl', photo)
    }
  }, [photo, router, setValue])

  const onSubmit = async (data: MemeFormData) => {
    try {
      let imageDataUrl: string

      if (data.imageUrl) {
        imageDataUrl = data.imageUrl
      } else if (data.imageFile && data.imageFile.length > 0) {
        imageDataUrl = await fileToBase64(data.imageFile[0])
      } else {
        console.error('Ошибка: не указано изображение')
        return
      }

      const payload: Omit<TMeme, 'id' | 'createdAt'> = {
        title: data.title,
        description: data.description,
        image: imageDataUrl,
      }
      await addMeme(payload).unwrap()
      reset({
        title: '',
        description: '',
        imageFile: null,
        imageUrl: null,
      })
      resetField('imageFile')
      setValue('imageUrl', null)
      router.replace(window.location.pathname)
    } catch (error) {
      console.error('Ошибка сохранения:', error)
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  return (
    <div className="max-w-xl mx-auto pу-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Редактор мемов</h1>
      <div className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Заголовок мема
              <input
                type="text"
                {...register('title', {
                  maxLength: {
                    value: 50,
                    message: 'Максимум 50 символов',
                  },
                })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                placeholder="Введите заголовок (необязательно)"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </label>
            <label className="block text-sm font-medium mb-2">
              Описание *
              <textarea
                rows={3}
                {...register('description', {
                  required: 'Текст мема обязателен',
                  minLength: {
                    value: 1,
                    message: 'Введите текст мема',
                  },
                })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white text-gray-900"
                placeholder="Введите текст для мема..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </label>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-300 w-full relative">
            {photo ? (
              <Image
                src={photo}
                alt={'photo'}
                height={100}
                width={100}
                className="object-cover w-full h-full"
              />
            ) : (
              <input
                type="file"
                accept="image/*"
                {...register('imageFile')}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            )}
            {errors.imageFile &&
              'message' in errors.imageFile &&
              typeof errors.imageFile.message === 'string' && (
                <p className="text-red-500 text-sm mt-1">{errors.imageFile.message}</p>
              )}
          </div>
          {errors.root && <p className="text-red-500 text-sm">{errors.root.message}</p>}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
          >
            {isSaving ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Сохранение...
              </div>
            ) : (
              'Сохранить описание'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

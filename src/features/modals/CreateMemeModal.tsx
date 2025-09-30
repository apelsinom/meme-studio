'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAddMemeMutation } from '@/store/memeApi'
import Image from 'next/image'

type FormValues = {
  caption: string
  file?: FileList
}

export default function CreateMemeModal() {
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [addMeme, { isLoading }] = useAddMemeMutation()
  const { register, handleSubmit, reset } = useForm<FormValues>()

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setPreview(null)
      return
    }
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const onSubmit = async (data: FormValues) => {
    if (!preview) {
      alert('Добавьте изображение')
      return
    }
    try {
      await addMeme({ title: data.caption ?? '', image: preview }).unwrap()
      reset()
      setPreview(null)
      setOpen(false)
    } catch (err) {
      console.error(err)
      alert(`Ошибка отправки: ${(err as any)?.message ?? ''}`)
    }
  }

  return (
    <>
      <button
        className="px-4 py-2 bg-primary1 text-white rounded-md shadow"
        onClick={() => setOpen(true)}
      >
        Создать мем
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Создать мем</h3>
              <button onClick={() => setOpen(false)} className="text-sm text-muted-foreground">
                Закрыть
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Подпись</label>
                <input
                  {...register('caption')}
                  className="w-full border rounded px-2 py-1"
                  placeholder="Например: Когда код работает с первого раза..."
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Изображение</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    onFileChange(e)
                    // keep react-hook-form file value (optional)
                    // @ts-ignore
                    register('file').onChange?.(e)
                  }}
                />
              </div>

              {preview && (
                <div className="border rounded p-2">
                  <div className="text-xs mb-2">Превью (клик правой — сохранить):</div>
                  <Image
                    height={100}
                    width={100}
                    src={preview}
                    alt="preview"
                    className="max-h-48 object-contain w-full"
                  />
                  <div className="mt-2 flex gap-2">
                    <a
                      href={preview}
                      download={`meme-${Date.now()}.png`}
                      className="text-sm underline"
                    >
                      Скачать
                    </a>
                    <button
                      type="button"
                      onClick={() => setPreview(null)}
                      className="text-sm text-red-600"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    reset()
                    setPreview(null)
                    setOpen(false)
                  }}
                  className="px-3 py-1 rounded border"
                >
                  Отмена
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-1 rounded bg-primary1 text-white disabled:opacity-60"
                >
                  {isLoading ? 'Создаём...' : 'Создать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

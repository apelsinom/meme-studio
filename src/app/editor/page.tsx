'use client'

import { useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAddMemeMutation } from '@/store/memeApi'

interface MemeFormData {
  title: string
  text: string
  image: FileList | null
}

export default function EditorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [addMeme, { isLoading: isSaving }] = useAddMemeMutation()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<MemeFormData>({
    defaultValues: {
      title: '',
      text: 'Твой текст здесь',
      image: null,
    },
  })

  const watchedText = watch('text')
  const watchedImage = watch('image')

  useEffect(() => {
    drawPreview().then()
  }, [watchedText, watchedImage])

  const drawPreview = async () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Если есть загруженное изображение
    if (watchedImage?.[0]) {
      const file = watchedImage[0]
      const imageUrl = URL.createObjectURL(file)

      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        drawTextOverlay(ctx, canvas)
        URL.revokeObjectURL(imageUrl)
      }
      img.src = imageUrl
    } else {
      // Простой мем с фоном
      ctx.fillStyle = '#1f2937'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      drawTextOverlay(ctx, canvas)
    }
  }

  const drawTextOverlay = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (!watchedText) return

    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 3
    ctx.font = 'bold 24px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Обводка для лучшей читаемости
    ctx.strokeText(watchedText, canvas.width / 2, canvas.height / 2)
    ctx.fillText(watchedText, canvas.width / 2, canvas.height / 2)
  }

  const onSubmit = async (data: MemeFormData) => {
    try {
      let imageDataUrl: string

      if (data.image?.[0]) {
        // Конвертируем File в base64
        imageDataUrl = await fileToBase64(data.image[0])
      } else {
        // Создаем мем из canvas
        imageDataUrl = canvasRef.current!.toDataURL('image/png')
      }

      // Сохраняем через RTK Query
      await addMeme({
        title: data.title || data.text,
        image: imageDataUrl,
      }).unwrap()

      alert('✅ Мем успешно сохранен!')
      reset()
    } catch (error) {
      console.error('Ошибка сохранения:', error)
      alert('❌ Ошибка при сохранении мема')
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Редактор мемов</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Форма */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Поле заголовка */}
            <div>
              <label className="block text-sm font-medium mb-2">Заголовок мема</label>
              <input
                type="text"
                {...register('title', {
                  maxLength: {
                    value: 50,
                    message: 'Максимум 50 символов',
                  },
                })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Введите заголовок (необязательно)"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            {/* Поле текста мема */}
            <div>
              <label className="block text-sm font-medium mb-2">Текст мема *</label>
              <textarea
                rows={3}
                {...register('text', {
                  required: 'Текст мема обязателен',
                  minLength: {
                    value: 1,
                    message: 'Введите текст мема',
                  },
                })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Введите текст для мема..."
              />
              {errors.text && <p className="text-red-500 text-sm mt-1">{errors.text.message}</p>}
            </div>

            {/* Поле загрузки файла */}
            <div>
              <label className="block text-sm font-medium mb-2">Фоновое изображение</label>
              <input
                type="file"
                accept="image/*"
                {...register('image')}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-sm text-gray-500 mt-1">
                Оставьте пустым для создания текстового мема
              </p>
            </div>

            {/* Кнопка отправки */}
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
                '💾 Сохранить мем'
              )}
            </button>
          </form>
        </div>

        {/* Предпросмотр */}
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-4">Предпросмотр</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 bg-gray-50">
            <canvas ref={canvasRef} width={400} height={400} className="rounded shadow-lg" />
          </div>
          <p className="text-sm text-gray-500 mt-3">Размер: 400×400px</p>
        </div>
      </div>

      {/* Информация о типах рендеринга */}
      <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
        <h2 className="text-xl font-bold mb-4 text-center">📄 О странице</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-white rounded shadow">
            <div className="font-semibold text-green-600">Editor</div>
            <div className="text-sm text-gray-600">CSR</div>
          </div>
          <div className="p-3 bg-white rounded shadow">
            <div className="font-semibold text-blue-600">Gallery</div>
            <div className="text-sm text-gray-600">SSG</div>
          </div>
          <div className="p-3 bg-white rounded shadow">
            <div className="font-semibold text-orange-600">My Memes</div>
            <div className="text-sm text-gray-600">SSR</div>
          </div>
          <div className="p-3 bg-white rounded shadow">
            <div className="font-semibold text-purple-600">About</div>
            <div className="text-sm text-gray-600">ISR</div>
          </div>
        </div>
      </div>
    </div>
  )
}

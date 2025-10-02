'use client'

import { useGetLocalMemesQuery, useDeleteMemeMutation } from '@/store/memeApi'
import Image from 'next/image'

export default function MyMemesPage() {
  const { data: memes = [], isLoading, isError, refetch } = useGetLocalMemesQuery()

  const [deleteMeme, { isLoading: isDeleting }] = useDeleteMemeMutation()

  const handleDelete = async (memeId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот мем?')) return

    try {
      await deleteMeme(memeId).unwrap()
    } catch (error) {
      console.error('Error deleting meme:', error)
      alert('Ошибка при удалении мема')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Загрузка мемов...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64">
        <div className="text-red-500 text-lg mb-4">Ошибка при загрузке мемов</div>
        <button
          onClick={refetch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Повторить попытку
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Мои мемы</h1>
        <button
          onClick={refetch}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Обновление...' : '🔄 Обновить'}
        </button>
      </div>

      {memes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg mb-2">Нет сохранённых мемов</p>
          <p className="text-sm text-gray-400">
            Создайте мемы в редакторе, чтобы они появились здесь
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {memes.map(meme => (
            <div key={meme.id} className="border rounded-lg shadow-lg overflow-hidden bg-white">
              <Image
                height={100}
                width={100}
                src={meme.image}
                alt={meme.title || meme.description || 'meme'}
                className="w-full aspect-square object-cover"
              />
              <div className="p-4">
                <h3 className="text-sm font-medium mb-3 line-clamp-2 min-h-10">{meme.title}</h3>
                <button
                  onClick={() => handleDelete(meme.id)}
                  disabled={isDeleting}
                  className="w-full bg-red-500 text-white py-2 px-3 rounded text-sm hover:bg-red-600 disabled:bg-gray-400"
                >
                  {isDeleting ? '⏳ Удаление...' : '🗑️ Удалить'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

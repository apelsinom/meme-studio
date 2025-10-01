import Image from 'next/image'
import { PixabayDTO, PixabayImage, TMeme } from '@/shared/types/types'
import Link from 'next/link'

export const revalidate = false

export default async function HomePage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PIXABAY_API_URL}?key=${process.env.NEXT_PUBLIC_PIXABAY_API_KEY}&q=cats&per_page=8`,
    { cache: 'force-cache' },
  )

  if (!res.ok) {
    throw new Error('Failed to fetch photos')
  }
  const data: PixabayDTO = await res.json()
  const photos: Required<TMeme>[] = data.hits.map((hit: PixabayImage) => ({
    id: hit.id.toString(),
    title: hit.type,
    description: hit.tags,
    image: hit.previewURL,
    createdAt: new Date().toISOString(),
  }))

  return (
    <div>
      <p className="py-4">
        Кликайте на понравившегося питомца, для добавления описания. Для выбора фотографий других
        питомцев нужно перейти в галерею
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map(photo => (
          <Link
            key={photo.id}
            href={`editor?src=${encodeURIComponent(photo.image)}`}
            className="border rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform"
          >
            <h2>{photo.title}</h2>
            <Image
              width={100}
              height={100}
              src={photo.image}
              alt={photo.title}
              className="w-full aspect-square"
            />
            <p className="p-1 text-sm text-start line-clamp-2">{photo.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

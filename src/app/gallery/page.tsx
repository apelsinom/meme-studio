import { PixabayDTO, PixabayImage, TMeme } from '@/shared/types/types'
import Image from 'next/image'

export const revalidate = false

export default async function GalleryPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PIXABAY_API_URL}?key=${process.env.NEXT_PUBLIC_PIXABAY_API_KEY}&per_page=12`,
    { cache: 'force-cache' },
  )

  if (!res.ok) {
    throw new Error('Failed to fetch photos')
  }
  const data: PixabayDTO = await res.json()
  const photos: TMeme[] = data.hits.map((hit: PixabayImage) => ({
    id: hit.id.toString(),
    title: hit.tags,
    image: hit.previewURL,
  }))

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Галерея мемов</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map(photo => (
          <div key={photo.id} className="border rounded-lg shadow overflow-hidden">
            <Image
              width={100}
              height={100}
              src={photo.image}
              alt={photo.title}
              className="w-full aspect-square"
            />
            <div className="p-1 text-sm line-clamp-3">{photo.title}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

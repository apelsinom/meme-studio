'use client'

import { useRouter } from 'next/navigation'

const topics = ['cats', 'dogs', 'cars', 'memes']

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
      {topics.map(topic => (
        <button
          key={topic}
          onClick={() => router.push(`/gallery?q=${topic}`)}
          className="p-6 bg-blue-100 rounded-lg hover:bg-blue-200 text-lg font-semibold transition"
        >
          {topic}
        </button>
      ))}
    </div>
  )
}

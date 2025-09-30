import { NextResponse } from 'next/server'
import { v4 as uuid } from 'uuid'
import { TMeme } from '@/shared/types/types'
import { getMemes, saveMeme, deleteMeme } from '@/lib/redis'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q') || 'cats'
    const page = searchParams.get('page') || '1'
    const local = searchParams.get('local')

    if (local === 'true') {
      const localMemes = await getMemes()
      return NextResponse.json(localMemes)
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PIXABAY_API_URL}?key=${process.env.NEXT_PUBLIC_PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&page=${page}&per_page=12`,
    )

    if (!res.ok) {
      return NextResponse.json({ error: 'Pixabay fetch failed' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('GET /api/memes failed:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, image } = body

    if (!image) {
      return NextResponse.json({ error: 'image required' }, { status: 400 })
    }

    const newMeme: TMeme = {
      id: uuid(),
      title: title ?? 'Без названия',
      image,
      createdAt: new Date().toISOString(),
    }

    await saveMeme(newMeme)
    return NextResponse.json(newMeme)
  } catch (err) {
    console.error('POST /api/memes failed:', err)
    return NextResponse.json({ error: 'invalid request' }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id parameter is required' }, { status: 400 })
    }

    await deleteMeme(id)
    return NextResponse.json({
      success: true,
      message: 'Meme deleted successfully',
      deletedId: id,
    })
  } catch (err) {
    console.error('DELETE /api/memes failed:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

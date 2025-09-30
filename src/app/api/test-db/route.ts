// app/api/test-db/route.ts
import { redis } from '@/lib/redis'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Тест записи
    await redis.set('connection_test', {
      status: 'success',
      message: 'Connected to Upstash Redis!',
      timestamp: new Date().toISOString(),
    })

    // Тест чтения
    const testData = await redis.get('connection_test')

    return NextResponse.json({
      success: true,
      data: testData,
      message: 'Upstash Redis is working correctly!',
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: String(error),
        message: 'Check your environment variables KV_REST_API_URL and KV_REST_API_TOKEN',
      },
      { status: 500 },
    )
  }
}

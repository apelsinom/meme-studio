import { Redis } from '@upstash/redis'
import { TMeme } from '@/shared/types/types'

export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

const MEMES_KEY = 'memes'

export async function getMemes() {
  try {
    const memes = await redis.get<TMeme[]>(MEMES_KEY)
    return memes || []
  } catch (error) {
    console.error('Error getting memes from Redis:', error)
    return []
  }
}

export async function saveMeme(meme: TMeme) {
  try {
    const memes = await getMemes()
    const updatedMemes = [meme, ...memes]
    await redis.set(MEMES_KEY, updatedMemes)
  } catch (error) {
    console.error('Error saving meme to Redis:', error)
    throw error
  }
}

export async function deleteMeme(memeId: string) {
  try {
    const memes = await getMemes()
    const updatedMemes = memes.filter(meme => meme.id !== memeId)
    await redis.set(MEMES_KEY, updatedMemes)
  } catch (error) {
    console.error('Error deleting meme from Redis:', error)
    throw error
  }
}

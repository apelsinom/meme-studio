export type TMeme = {
  id: string
  title?: string
  description: string
  image: string
  createdAt?: string
}

export type PixabayDTO = {
  total: number
  totalHits: number
  hits: PixabayImage[]
}

export type PixabayImage = {
  id: number
  pageURL: string
  type: 'photo' | 'illustration' | 'vector'
  tags: string
  previewURL: string
  previewWidth: number
  previewHeight: number
  webformatURL: string
  webformatWidth: number
  webformatHeight: number
  largeImageURL: string
  fullHDURL: string
  imageURL: string
  imageWidth: number
  imageHeight: number
  imageSize: number
  views: number
  downloads: number
  likes: number
  comments: number
  user_id: number
  user: string
  userImageURL: string
  collections: number
  isAiGenerated: boolean
  isGRated: boolean
  isLowQuality: boolean
  noAiTraining: boolean
}

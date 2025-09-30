export type TMeme = {
  id: string
  title: string
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
  collections: number
  comments: number
  downloads: number
  imageHeight: number
  imageSize: number
  imageWidth: number
  isAiGenerated: boolean
  isGRated: boolean
  isLowQuality: boolean
  largeImageURL: string
  likes: number
  noAiTraining: boolean
  pageURL: string
  previewHeight: number
  previewURL: string
  previewWidth: number
  tags: string
  type: 'all' | 'photo' | 'illustration' | 'vector'
  user: string
  userImageURL: string
  userURL: string
  user_id: number
  views: number
  webformatHeight: number
  webformatURL: string
  webformatWidth: number
}

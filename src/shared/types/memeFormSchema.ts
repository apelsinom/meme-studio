import { z } from 'zod'

export const memeFormSchema = z.object({
  title: z.string().max(20, 'Максимум 20 символов').optional(),
  description: z.string().min(1, 'Текст мема обязателен').max(50, 'Максимум 50 символов'),
  imageUrl: z.string().nullish(),
  imageFile: (typeof FileList !== 'undefined'
    ? z.instanceof(FileList, { message: 'Загрузите файл изображения' })
    : z.any()
  )
    .nullable()
    .optional()
    .refine(
      files => !files || files.length === 0 || files.length === 1,
      'Можно загрузить только один файл',
    )
    .refine(
      files => !files || files.length === 0 || files[0].type.startsWith('image/'),
      'Файл должен быть изображением',
    )
    .refine(
      files => !files || files.length === 0 || files[0].size <= 5 * 1024 * 1024,
      'Размер файла не должен превышать 5MB',
    ),
})

export type MemeFormData = z.infer<typeof memeFormSchema>

export type CircleCategory = '宿舍' | '年级' | '熟悉度' | '类型'

export interface Circle {
  id: string
  name: string
  description: string
  category: CircleCategory
  memberCount: number
  tags: string[]
  cover: string
  createdAt: string
  isJoined: boolean
}

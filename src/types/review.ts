export interface ReviewPlayer {
  id: string
  name: string
  avatar: string
  isNoShow: boolean
  isRecommendDM: boolean
  preference: '阵营' | '情感' | '都喜欢' | '未标记'
}

export interface Review {
  id: string
  gameId: string
  gameTitle: string
  scriptName: string
  circleName: string
  gameTime: string
  createdAt: string
  organizerId: string
  players: ReviewPlayer[]
  overallComment: string
}

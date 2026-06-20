export type GameStatus = 'recruiting' | 'locked' | 'playing' | 'finished' | 'cancelled'

export type ScriptTag = '新手' | '欢乐' | '硬核' | '情感' | '阵营' | '恐怖' | '机制' | '推理'

export interface Player {
  id: string
  name: string
  avatar: string
  joinedAt: string
}

export interface Game {
  id: string
  title: string
  scriptName: string
  tags: ScriptTag[]
  playerCount: number
  currentPlayers: number
  waitlistCount: number
  cost: number
  location: string
  allowSpectate: boolean
  status: GameStatus
  circleId: string
  circleName: string
  organizerId: string
  organizerName: string
  organizerAvatar: string
  gameTime: string
  createdAt: string
  description: string
  players: Player[]
  waitlist: Player[]
}

import { create } from 'zustand'
import type { Game, ScriptTag } from '@/types/game'
import type { Circle, CircleCategory } from '@/types/circle'
import type { User } from '@/types/user'
import type { Review, ReviewPlayer } from '@/types/review'

interface CreateGameParams {
  title: string
  scriptName: string
  tags: ScriptTag[]
  circleId: string
  circleName: string
  playerCount: number
  cost: number
  location: string
  gameTime: string
  allowSpectate: boolean
  description: string
}

interface CreateCircleParams {
  name: string
  description: string
  category: CircleCategory
  tags: string[]
}

interface CreateReviewParams {
  gameId: string
  gameTitle: string
  scriptName: string
  circleName: string
  gameTime: string
  players: ReviewPlayer[]
  overallComment: string
}

interface AppState {
  currentUser: User
  games: Game[]
  circles: Circle[]
  reviews: Review[]
  setCurrentUser: (user: User) => void
  setGames: (games: Game[]) => void
  setCircles: (circles: Circle[]) => void
  setReviews: (reviews: Review[]) => void
  joinGame: (gameId: string) => void
  joinWaitlist: (gameId: string) => void
  toggleCircleJoin: (circleId: string) => void
  addGame: (params: CreateGameParams) => Game
  addCircle: (params: CreateCircleParams) => Circle
  addReview: (params: CreateReviewParams) => Review
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: {
    id: 'u001',
    name: '林小鹿',
    avatar: 'https://picsum.photos/id/64/200/200',
    grade: '大三',
    dorm: '梅园3号楼',
    preferences: ['情感', '阵营', '欢乐'],
    joinDate: '2024-09-01',
    gameCount: 28,
    dmCount: 5,
    circleCount: 4
  },
  games: [],
  circles: [],
  reviews: [],
  setCurrentUser: (user) => set({ currentUser: user }),
  setGames: (games) => set({ games }),
  setCircles: (circles) => set({ circles }),
  setReviews: (reviews) => set({ reviews }),
  joinGame: (gameId) =>
    set((state) => ({
      games: state.games.map((g) => {
        if (g.id !== gameId) return g
        const newCount = g.currentPlayers + 1
        const isFull = newCount >= g.playerCount
        return {
          ...g,
          currentPlayers: newCount,
          status: isFull ? 'locked' : g.status,
          players: [
            ...g.players,
            {
              id: state.currentUser.id,
              name: state.currentUser.name,
              avatar: state.currentUser.avatar,
              joinedAt: new Date().toISOString()
            }
          ]
        }
      })
    })),
  joinWaitlist: (gameId) =>
    set((state) => ({
      games: state.games.map((g) => {
        if (g.id !== gameId) return g
        return {
          ...g,
          waitlistCount: g.waitlistCount + 1,
          waitlist: [
            ...g.waitlist,
            {
              id: state.currentUser.id,
              name: state.currentUser.name,
              avatar: state.currentUser.avatar,
              joinedAt: new Date().toISOString()
            }
          ]
        }
      })
    })),
  toggleCircleJoin: (circleId) =>
    set((state) => ({
      circles: state.circles.map((c) => {
        if (c.id !== circleId) return c
        const isJoined = !c.isJoined
        return {
          ...c,
          isJoined,
          memberCount: isJoined ? c.memberCount + 1 : c.memberCount - 1,
          ...(!isJoined && { isJoined: c.isJoined })
        }
      })
    })),
  addGame: (params) => {
    const state = get()
    const newGame: Game = {
      id: `g${Date.now()}`,
      title: params.title || `${params.scriptName} · ${state.currentUser.name}的车`,
      scriptName: params.scriptName,
      tags: params.tags,
      playerCount: params.playerCount,
      currentPlayers: 1,
      waitlistCount: 0,
      cost: params.cost,
      location: params.location,
      allowSpectate: params.allowSpectate,
      status: 'recruiting',
      circleId: params.circleId,
      circleName: params.circleName,
      organizerId: state.currentUser.id,
      organizerName: state.currentUser.name,
      organizerAvatar: state.currentUser.avatar,
      gameTime: params.gameTime || new Date(Date.now() + 86400000).toISOString(),
      createdAt: new Date().toISOString(),
      description: params.description,
      players: [
        {
          id: state.currentUser.id,
          name: state.currentUser.name,
          avatar: state.currentUser.avatar,
          joinedAt: new Date().toISOString()
        }
      ],
      waitlist: []
    }
    set((s) => ({ games: [newGame, ...s.games] }))
    console.log('[Store] addGame:', newGame)
    return newGame
  },
  addCircle: (params) => {
    const coverMap: Record<string, string[]> = {
      宿舍: ['https://picsum.photos/id/787/400/200', 'https://picsum.photos/id/1082/400/200'],
      年级: ['https://picsum.photos/id/1039/400/200', 'https://picsum.photos/id/1044/400/200'],
      熟悉度: ['https://picsum.photos/id/1018/400/200', 'https://picsum.photos/id/3/400/200'],
      类型: ['https://picsum.photos/id/1015/400/200', 'https://picsum.photos/id/1036/400/200']
    }
    const covers = coverMap[params.category] || coverMap.类型
    const cover = covers[Math.floor(Math.random() * covers.length)]

    const newCircle: Circle = {
      id: `c${Date.now()}`,
      name: params.name,
      description: params.description,
      category: params.category,
      memberCount: 1,
      tags: params.tags,
      cover,
      createdAt: new Date().toISOString(),
      isJoined: true
    }
    set((s) => ({ circles: [newCircle, ...s.circles] }))
    console.log('[Store] addCircle:', newCircle)
    return newCircle
  },
  addReview: (params) => {
    const newReview: Review = {
      id: `r${Date.now()}`,
      gameId: params.gameId,
      gameTitle: params.gameTitle,
      scriptName: params.scriptName,
      circleName: params.circleName,
      gameTime: params.gameTime,
      createdAt: new Date().toISOString(),
      organizerId: get().currentUser.id,
      players: params.players,
      overallComment: params.overallComment
    }
    set((s) => ({ reviews: [newReview, ...s.reviews] }))
    console.log('[Store] addReview:', newReview)
    return newReview
  }
}))

import { create } from 'zustand'
import type { Game } from '@/types/game'
import type { Circle } from '@/types/circle'
import type { User } from '@/types/user'

interface AppState {
  currentUser: User
  games: Game[]
  circles: Circle[]
  setCurrentUser: (user: User) => void
  setGames: (games: Game[]) => void
  setCircles: (circles: Circle[]) => void
  joinGame: (gameId: string) => void
  joinWaitlist: (gameId: string) => void
  toggleCircleJoin: (circleId: string) => void
}

export const useAppStore = create<AppState>((set) => ({
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
  setCurrentUser: (user) => set({ currentUser: user }),
  setGames: (games) => set({ games }),
  setCircles: (circles) => set({ circles }),
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
          memberCount: isJoined ? c.memberCount + 1 : c.memberCount - 1
        }
      })
    }))
}))

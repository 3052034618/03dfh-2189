import type { User } from '@/types/user'

export const mockUsers: User[] = [
  {
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
  {
    id: 'u002',
    name: '陈墨白',
    avatar: 'https://picsum.photos/id/91/200/200',
    grade: '大三',
    dorm: '梅园3号楼',
    preferences: ['推理', '硬核'],
    joinDate: '2024-09-01',
    gameCount: 35,
    dmCount: 8,
    circleCount: 3
  },
  {
    id: 'u003',
    name: '苏小糖',
    avatar: 'https://picsum.photos/id/177/200/200',
    grade: '大二',
    dorm: '松园2号楼',
    preferences: ['情感', '欢乐'],
    joinDate: '2024-10-15',
    gameCount: 22,
    dmCount: 3,
    circleCount: 4
  },
  {
    id: 'u009',
    name: '孙逸飞',
    avatar: 'https://picsum.photos/id/3/200/200',
    grade: '大三',
    dorm: '竹园1号楼',
    preferences: ['硬核', '推理', '恐怖'],
    joinDate: '2024-09-01',
    gameCount: 42,
    dmCount: 12,
    circleCount: 3
  }
]

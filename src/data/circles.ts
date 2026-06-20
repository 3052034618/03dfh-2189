import type { Circle } from '@/types/circle'

export const mockCircles: Circle[] = [
  {
    id: 'c001',
    name: '梅园3号楼车圈',
    description: '梅园3号楼的社员专属，方便约线下本',
    category: '宿舍',
    memberCount: 12,
    tags: ['欢乐', '新手', '推理'],
    cover: 'https://picsum.photos/id/787/400/200',
    createdAt: '2024-10-01',
    isJoined: true
  },
  {
    id: 'c002',
    name: '情感沉浸车圈',
    description: '专注于情感本，喜欢哭的同学看过来～',
    category: '类型',
    memberCount: 8,
    tags: ['情感', '沉浸'],
    cover: 'https://picsum.photos/id/1015/400/200',
    createdAt: '2024-11-15',
    isJoined: true
  },
  {
    id: 'c003',
    name: '硬核推理车圈',
    description: '只为硬核玩家准备，新手勿入',
    category: '类型',
    memberCount: 15,
    tags: ['硬核', '推理', '恐怖'],
    cover: 'https://picsum.photos/id/1036/400/200',
    createdAt: '2024-09-20',
    isJoined: true
  },
  {
    id: 'c004',
    name: '大二车圈',
    description: '大二社员专属，熟悉度高的熟人车',
    category: '年级',
    memberCount: 10,
    tags: ['阵营', '机制', '欢乐'],
    cover: 'https://picsum.photos/id/1039/400/200',
    createdAt: '2024-10-10',
    isJoined: false
  },
  {
    id: 'c005',
    name: '大一萌新车圈',
    description: '大一新生专属，老手带飞，低压力约本',
    category: '年级',
    memberCount: 18,
    tags: ['新手', '欢乐'],
    cover: 'https://picsum.photos/id/1044/400/200',
    createdAt: '2025-03-01',
    isJoined: false
  },
  {
    id: 'c006',
    name: '松园2号楼车圈',
    description: '松园2号楼社员线下约本方便',
    category: '宿舍',
    memberCount: 9,
    tags: ['情感', '欢乐'],
    cover: 'https://picsum.photos/id/1018/400/200',
    createdAt: '2024-12-01',
    isJoined: true
  },
  {
    id: 'c007',
    name: '老成员熟人车',
    description: '入社半年以上的老成员，默契度高',
    category: '熟悉度',
    memberCount: 11,
    tags: ['硬核', '阵营', '推理'],
    cover: 'https://picsum.photos/id/1082/400/200',
    createdAt: '2024-09-05',
    isJoined: true
  },
  {
    id: 'c008',
    name: '考后解压车圈',
    description: '每次考试后的固定解压约本',
    category: '类型',
    memberCount: 20,
    tags: ['欢乐', '新手', '轻松'],
    cover: 'https://picsum.photos/id/3/400/200',
    createdAt: '2025-01-15',
    isJoined: false
  }
]

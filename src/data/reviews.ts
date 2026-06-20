import type { Review } from '@/types/review'

export const mockReviews: Review[] = [
  {
    id: 'r001',
    gameId: 'g002',
    gameTitle: '老成员硬核车 · 深度推理',
    scriptName: '死者在说话',
    circleName: '硬核推理车圈',
    gameTime: '2025-06-18T19:00:00',
    createdAt: '2025-06-19T08:00:00',
    organizerId: 'u009',
    players: [
      { id: 'u009', name: '孙逸飞', avatar: 'https://picsum.photos/id/3/200/200', isNoShow: false, isRecommendDM: true, preference: '阵营' },
      { id: 'u010', name: '钱多多', avatar: 'https://picsum.photos/id/6/200/200', isNoShow: false, isRecommendDM: false, preference: '阵营' },
      { id: 'u011', name: '冯小刚', avatar: 'https://picsum.photos/id/8/200/200', isNoShow: true, isRecommendDM: false, preference: '未标记' },
      { id: 'u012', name: '蒋小花', avatar: 'https://picsum.photos/id/9/200/200', isNoShow: false, isRecommendDM: false, preference: '情感' },
      { id: 'u013', name: '韩冰冰', avatar: 'https://picsum.photos/id/119/200/200', isNoShow: false, isRecommendDM: false, preference: '情感' },
      { id: 'u014', name: '许三多', avatar: 'https://picsum.photos/id/160/200/200', isNoShow: false, isRecommendDM: false, preference: '都喜欢' }
    ],
    overallComment: '整体逻辑在线，冯小刚临时鸽了临时找替补，孙逸飞当DM很稳，下次继续！'
  },
  {
    id: 'r002',
    gameId: 'g004',
    gameTitle: '阵营对抗车 · 谁是内鬼',
    scriptName: '孤城',
    circleName: '大二车圈',
    gameTime: '2025-06-15T19:00:00',
    createdAt: '2025-06-16T10:00:00',
    organizerId: 'u010',
    players: [
      { id: 'u010', name: '钱多多', avatar: 'https://picsum.photos/id/6/200/200', isNoShow: false, isRecommendDM: false, preference: '阵营' },
      { id: 'u011', name: '冯小刚', avatar: 'https://picsum.photos/id/8/200/200', isNoShow: false, isRecommendDM: true, preference: '阵营' },
      { id: 'u012', name: '蒋小花', avatar: 'https://picsum.photos/id/9/200/200', isNoShow: false, isRecommendDM: false, preference: '情感' },
      { id: 'u019', name: '张三丰', avatar: 'https://picsum.photos/id/1/200/200', isNoShow: false, isRecommendDM: false, preference: '阵营' },
      { id: 'u020', name: '李莫愁', avatar: 'https://picsum.photos/id/2/200/200', isNoShow: false, isRecommendDM: false, preference: '情感' },
      { id: 'u021', name: '黄药师', avatar: 'https://picsum.photos/id/3/200/200', isNoShow: false, isRecommendDM: false, preference: '阵营' }
    ],
    overallComment: '阵营本玩得很嗨，大家代入感强，冯小刚控场能力不错，下次可以当DM。'
  }
]

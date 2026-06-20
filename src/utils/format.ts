import dayjs from 'dayjs'

export const formatTime = (time: string) => {
  return dayjs(time).format('MM/DD HH:mm')
}

export const formatCost = (cost: number) => {
  if (cost === 0) return '免费'
  return `¥${cost}/人`
}

export const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    recruiting: '招人中',
    locked: '已锁车',
    playing: '游戏中',
    finished: '已结束',
    cancelled: '已取消'
  }
  return map[status] || status
}

export const getTagColor = (tag: string) => {
  const map: Record<string, string> = {
    '新手': '#6C5CE7',
    '欢乐': '#00b42a',
    '硬核': '#f53f3f',
    '情感': '#FD79A8',
    '阵营': '#ff7d00',
    '恐怖': '#5A4BD1',
    '机制': '#165dff',
    '推理': '#86909c'
  }
  return map[tag] || '#86909c'
}

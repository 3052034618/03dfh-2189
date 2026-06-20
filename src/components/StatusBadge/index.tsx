import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import { getStatusText } from '@/utils/format'
import styles from './index.module.scss'

interface StatusBadgeProps {
  status: string
}

const statusStyleMap: Record<string, string> = {
  recruiting: styles.recruiting,
  locked: styles.locked,
  playing: styles.playing,
  finished: styles.finished,
  cancelled: styles.cancelled
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <View className={classnames(styles.badge, statusStyleMap[status])}>
      <Text className={styles.badgeText}>{getStatusText(status)}</Text>
    </View>
  )
}

export default StatusBadge

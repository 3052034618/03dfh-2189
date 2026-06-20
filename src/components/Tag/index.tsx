import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import { getTagColor } from '@/utils/format'
import styles from './index.module.scss'

interface TagProps {
  text: string
  color?: string
  size?: 'small' | 'medium'
}

const Tag: React.FC<TagProps> = ({ text, color, size = 'small' }) => {
  const tagColor = color || getTagColor(text)

  return (
    <View
      className={classnames(styles.tag, size === 'medium' && styles.tagMedium)}
      style={{ color: tagColor, backgroundColor: `${tagColor}15` }}
    >
      <Text className={styles.tagText}>{text}</Text>
    </View>
  )
}

export default Tag

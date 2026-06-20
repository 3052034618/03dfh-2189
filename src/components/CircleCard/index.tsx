import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import type { Circle } from '@/types/circle'
import Tag from '@/components/Tag'
import styles from './index.module.scss'

interface CircleCardProps {
  circle: Circle
}

const CircleCard: React.FC<CircleCardProps> = ({ circle }) => {
  const categoryIcons: Record<string, string> = {
    '宿舍': '🏠',
    '年级': '🎓',
    '熟悉度': '🤝',
    '类型': '🎭'
  }

  const handleClick = () => {
    Taro.navigateTo({ url: `/pages/circleDetail/index?id=${circle.id}` })
  }

  return (
    <View className={styles.card} onClick={handleClick}>
      <Image className={styles.cover} src={circle.cover} mode="aspectFill" />
      <View className={styles.overlay} />
      <View className={styles.content}>
        <View className={styles.categoryTag}>
          <Text className={styles.categoryIcon}>{categoryIcons[circle.category] || '🎭'}</Text>
          <Text className={styles.categoryText}>{circle.category}</Text>
        </View>
        <Text className={styles.name}>{circle.name}</Text>
        <Text className={styles.description}>{circle.description}</Text>
        <View className={styles.footer}>
          <View className={styles.tags}>
            {circle.tags.slice(0, 2).map((tag) => (
              <Tag key={tag} text={tag} />
            ))}
          </View>
          <View className={styles.memberCount}>
            <Text className={styles.memberIcon}>👥</Text>
            <Text className={styles.memberText}>{circle.memberCount}人</Text>
          </View>
        </View>
        {circle.isJoined && (
          <View className={styles.joinedBadge}>
            <Text className={styles.joinedText}>已加入</Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default CircleCard

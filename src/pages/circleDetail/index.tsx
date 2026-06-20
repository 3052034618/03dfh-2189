import React from 'react'
import { View, Text } from '@tarojs/components'
import styles from './index.module.scss'

const CircleDetailPage: React.FC = () => {
  return (
    <View className={styles.container}>
      <Text className={styles.title}>车圈详情</Text>
      <Text className={styles.hint}>功能正在开发中...</Text>
    </View>
  )
}

export default CircleDetailPage

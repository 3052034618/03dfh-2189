import React from 'react'
import { View, Text } from '@tarojs/components'
import styles from './index.module.scss'

const ReviewPage: React.FC = () => {
  return (
    <View className={styles.container}>
      <Text className={styles.title}>复盘</Text>
      <Text className={styles.hint}>功能正在开发中...</Text>
    </View>
  )
}

export default ReviewPage

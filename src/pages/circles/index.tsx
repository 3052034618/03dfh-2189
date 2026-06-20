import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import { useAppStore } from '@/store/appStore'
import { mockCircles } from '@/data/circles'
import CircleCard from '@/components/CircleCard'
import EmptyState from '@/components/EmptyState'
import styles from './index.module.scss'

const CATEGORY_TABS = ['全部', '宿舍', '年级', '熟悉度', '类型']

const CirclesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('全部')
  const { circles, setCircles } = useAppStore()

  useEffect(() => {
    setCircles(mockCircles)
  }, [])

  const myCircles = circles.filter((c) => c.isJoined)

  const filteredCircles = circles.filter((c) => {
    if (activeCategory === '全部') return true
    return c.category === activeCategory
  })

  const handleCreateCircle = () => {
    Taro.navigateTo({ url: '/pages/circleDetail/index' })
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>🎭 车圈</Text>
        <Text className={styles.subtitle}>找到你的熟人圈，定向约本</Text>
      </View>

      <ScrollView className={styles.categoryTabs} scrollX>
        <View className={styles.categoryTabsScroll}>
          {CATEGORY_TABS.map((tab) => (
            <View
              key={tab}
              className={classnames(
                styles.categoryTab,
                activeCategory === tab && styles.categoryTabActive
              )}
              onClick={() => setActiveCategory(tab)}
            >
              <Text
                className={classnames(
                  styles.categoryTabText,
                  activeCategory === tab && styles.categoryTabTextActive
                )}
              >
                {tab}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {myCircles.length > 0 && (
        <View className={styles.myCircles}>
          <Text className={styles.sectionTitle}>我的车圈</Text>
          <ScrollView className={styles.myCirclesScroll} scrollX>
            <View className={styles.myCirclesContent}>
              {myCircles.map((circle) => (
                <View
                  key={circle.id}
                  className={styles.myCircleCard}
                  onClick={() =>
                    Taro.navigateTo({ url: `/pages/circleDetail/index?id=${circle.id}` })
                  }
                >
                  <Image
                    className={styles.myCircleAvatar}
                    src={circle.cover}
                    mode="aspectFill"
                  />
                  <Text className={styles.myCircleName}>{circle.name}</Text>
                  <Text className={styles.myCircleCount}>{circle.memberCount}人</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      <Text className={styles.sectionTitle}>
        {activeCategory === '全部' ? '全部车圈' : activeCategory}
      </Text>
      <View className={styles.circleList}>
        {filteredCircles.length > 0 ? (
          filteredCircles.map((circle) => (
            <CircleCard key={circle.id} circle={circle} />
          ))
        ) : (
          <EmptyState message="暂无该类型车圈" />
        )}
      </View>

      <View className={styles.createBtn} onClick={handleCreateCircle}>
        <Text className={styles.createBtnText}>+</Text>
      </View>
    </View>
  )
}

export default CirclesPage

import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import classnames from 'classnames'
import { useAppStore } from '@/store/appStore'
import GameCard from '@/components/GameCard'
import EmptyState from '@/components/EmptyState'
import styles from './index.module.scss'

const FILTER_TABS = ['全部', '我的车圈', '新手友好', '硬核车', '情感沉浸', '还差人']

const HomePage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('全部')
  const { currentUser, games, circles } = useAppStore()

  const myCircleIds = useMemo(() => {
    return circles.filter((c) => c.isJoined).map((c) => c.id)
  }, [circles])

  const filteredGames = games.filter((game) => {
    switch (activeFilter) {
      case '我的车圈':
        return myCircleIds.includes(game.circleId)
      case '新手友好':
        return game.tags.includes('新手')
      case '硬核车':
        return game.tags.includes('硬核')
      case '情感沉浸':
        return game.tags.includes('情感')
      case '还差人':
        return game.status === 'recruiting'
      default:
        return true
    }
  })

  const recruitingCount = games.filter((g) => g.status === 'recruiting').length

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.greeting}>👋 {currentUser.name}</Text>
        <Text className={styles.greetingSub}>今天想约什么本？</Text>
      </View>

      <View className={styles.quickStats}>
        <View className={styles.statCard}>
          <Text className={styles.statNumber}>{recruitingCount}</Text>
          <Text className={styles.statLabel}>招人中</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statNumber}>{games.length}</Text>
          <Text className={styles.statLabel}>总车数</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statNumber}>{currentUser.gameCount}</Text>
          <Text className={styles.statLabel}>我的场次</Text>
        </View>
      </View>

      <ScrollView className={styles.filterTabs} scrollX>
        <View className={styles.filterTabsScroll}>
          {FILTER_TABS.map((tab) => (
            <View
              key={tab}
              className={classnames(
                styles.filterTab,
                activeFilter === tab && styles.filterTabActive
              )}
              onClick={() => setActiveFilter(tab)}
            >
              <Text
                className={classnames(
                  styles.filterTabText,
                  activeFilter === tab && styles.filterTabTextActive
                )}
              >
                {tab}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View className={styles.gameList}>
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => <GameCard key={game.id} game={game} />)
        ) : (
          <EmptyState message="暂无符合条件的约本" />
        )}
      </View>
    </View>
  )
}

export default HomePage

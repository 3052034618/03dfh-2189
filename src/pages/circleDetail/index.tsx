import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import { useAppStore } from '@/store/appStore'
import { mockCircles } from '@/data/circles'
import GameCard from '@/components/GameCard'
import EmptyState from '@/components/EmptyState'
import Tag from '@/components/Tag'
import styles from './index.module.scss'

const STATUS_TABS = [
  { key: 'recruiting', label: '招人中' },
  { key: 'locked', label: '已锁车' },
  { key: 'finished', label: '已结束' }
]

const CATEGORY_ICONS: Record<string, string> = {
  宿舍: '🏠',
  年级: '🎓',
  熟悉度: '🤝',
  类型: '🎭'
}

const CircleDetailPage: React.FC = () => {
  const { circles, games, toggleCircleJoin } = useAppStore()
  const [circleId, setCircleId] = useState('')
  const [activeStatus, setActiveStatus] = useState('recruiting')

  useEffect(() => {
    const params = Taro.getCurrentInstance().router?.params
    const id = params?.id || 'c001'
    setCircleId(id)
  }, [])

  const circle = useMemo(() => {
    return circles.find((c) => c.id === circleId) || mockCircles[0]
  }, [circles, circleId])

  const circleGames = useMemo(() => {
    return games.filter((g) => g.circleId === circleId)
  }, [games, circleId])

  const filteredGames = useMemo(() => {
    if (activeStatus === 'recruiting') {
      return circleGames.filter((g) => g.status === 'recruiting')
    }
    if (activeStatus === 'locked') {
      return circleGames.filter((g) => g.status === 'locked')
    }
    if (activeStatus === 'finished') {
      return circleGames.filter((g) => g.status === 'finished' || g.status === 'cancelled')
    }
    return circleGames
  }, [circleGames, activeStatus])

  const stats = useMemo(() => {
    return {
      recruiting: circleGames.filter((g) => g.status === 'recruiting').length,
      locked: circleGames.filter((g) => g.status === 'locked').length,
      finished: circleGames.filter((g) => g.status === 'finished' || g.status === 'cancelled').length
    }
  }, [circleGames])

  const handleToggleJoin = () => {
    toggleCircleJoin(circleId)
    Taro.showToast({
      title: circle.isJoined ? '已退出车圈' : '加入成功',
      icon: 'none'
    })
  }

  const handleGoCreate = () => {
    Taro.switchTab({ url: '/pages/create/index' })
  }

  return (
    <View className={styles.page}>
      <View className={styles.cover}>
        <Image className={styles.coverImage} src={circle.cover} mode="aspectFill" />
        <View className={styles.coverMask} />
        <View className={styles.coverContent}>
          <Text className={styles.coverCategory}>
            {CATEGORY_ICONS[circle.category]} {circle.category}
          </Text>
          <Text className={styles.coverName}>{circle.name}</Text>
          <Text className={styles.coverDesc}>{circle.description}</Text>
        </View>
      </View>

      <View className={styles.infoCard}>
        <View className={styles.infoRow}>
          <View className={styles.infoItem}>
            <Text className={styles.infoNumber}>{circle.memberCount}</Text>
            <Text className={styles.infoLabel}>成员</Text>
          </View>
          <View className={styles.infoDivider} />
          <View className={styles.infoItem}>
            <Text className={styles.infoNumber}>{circleGames.length}</Text>
            <Text className={styles.infoLabel}>总场次</Text>
          </View>
          <View className={styles.infoDivider} />
          <View className={styles.infoItem}>
            <Text className={styles.infoNumber}>{stats.recruiting}</Text>
            <Text className={styles.infoLabel}>招人中</Text>
          </View>
        </View>
        <View className={styles.tagRow}>
          {circle.tags.map((tag) => (
            <Tag key={tag} text={tag} size="sm" />
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>本圈约本</Text>
          {circle.isJoined && (
            <View className={styles.createBtn} onClick={handleGoCreate}>
              <Text className={styles.createBtnText}>+ 发一车</Text>
            </View>
          )}
        </View>

        <View className={styles.tabs}>
          {STATUS_TABS.map((tab) => (
            <View
              key={tab.key}
              className={classnames(
                styles.tab,
                activeStatus === tab.key && styles.tabActive
              )}
              onClick={() => setActiveStatus(tab.key)}
            >
              <Text
                className={classnames(
                  styles.tabText,
                  activeStatus === tab.key && styles.tabTextActive
                )}
              >
                {tab.label}
              </Text>
              <Text
                className={classnames(
                  styles.tabCount,
                  activeStatus === tab.key && styles.tabCountActive
                )}
              >
                {stats[tab.key as keyof typeof stats]}
              </Text>
            </View>
          ))}
        </View>

        {filteredGames.length > 0 ? (
          <View className={styles.gameList}>
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </View>
        ) : (
          <EmptyState message={`暂无${STATUS_TABS.find((t) => t.key === activeStatus)?.label}的约本`} />
        )}
      </View>

      <View className={styles.bottomBar}>
        <View
          className={classnames(
            styles.joinBtn,
            circle.isJoined && styles.joinBtnJoined
          )}
          onClick={handleToggleJoin}
        >
          <Text className={styles.joinBtnText}>
            {circle.isJoined ? '退出车圈' : '加入车圈'}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default CircleDetailPage

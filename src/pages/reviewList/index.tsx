import React, { useMemo } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import { useAppStore } from '@/store/appStore'
import { formatTime } from '@/utils/format'
import styles from './index.module.scss'

const ReviewListPage: React.FC = () => {
  const { reviews, games, currentUser } = useAppStore()

  const myReviews = useMemo(() => {
    return reviews.filter((r) => r.organizerId === currentUser.id)
  }, [reviews, currentUser.id])

  const handleGoCreate = () => {
    const finishedGames = games.filter((g) =>
      g.players.some((p) => p.id === currentUser.id) ||
      g.organizerId === currentUser.id ||
      g.status === 'locked' ||
      g.status === 'finished'
    )
    if (finishedGames.length === 0) {
      Taro.showToast({ title: '暂无可复盘的局', icon: 'none' })
      return
    }
    Taro.navigateTo({ url: '/pages/review/index' })
  }

  const handleViewDetail = (reviewId: string) => {
    Taro.navigateTo({ url: `/pages/review/index?reviewId=${reviewId}` })
  }

  if (myReviews.length === 0) {
    return (
      <View className={styles.page}>
        <View className={styles.emptyTip}>
          <Text className={styles.emptyIcon}>📝</Text>
          <Text className={styles.emptyText}>还没有复盘记录</Text>
          <View className={styles.goBtn} onClick={handleGoCreate}>
            <Text className={styles.goBtnText}>去写复盘</Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View className={styles.page}>
      {myReviews.map((review) => {
        const noShowCount = review.players.filter((p) => p.isNoShow).length
        const dmRecommendCount = review.players.filter((p) => p.isRecommendDM).length
        return (
          <View key={review.id} className={styles.card} onClick={() => handleViewDetail(review.id)}>
            <View className={styles.cardHeader}>
              <Text className={styles.cardTitle}>{review.scriptName}</Text>
              <View className={styles.cardTag}>
                <Text className={styles.cardTagText}>{review.circleName}</Text>
              </View>
            </View>
            <Text className={styles.cardSubtitle}>{review.gameTitle}</Text>
            <View className={styles.cardMeta}>
              <Text>🕒 {formatTime(review.gameTime)}</Text>
              <Text>👥 {review.players.length}人</Text>
            </View>
            <View className={styles.cardStats}>
              {noShowCount > 0 && (
                <View className={classnames(styles.statBadge, styles.statBadgeDanger)}>
                  <Text className={styles.statBadgeText}>🕊️ 鸽子 {noShowCount}人</Text>
                </View>
              )}
              {dmRecommendCount > 0 && (
                <View className={classnames(styles.statBadge, styles.statBadgeSuccess)}>
                  <Text className={styles.statBadgeText}>🎤 推荐DM {dmRecommendCount}人</Text>
                </View>
              )}
              <View className={styles.statBadge}>
                <Text className={styles.statBadgeText}>写于 {formatTime(review.createdAt)}</Text>
              </View>
            </View>
          </View>
        )
      })}
    </View>
  )
}

export default ReviewListPage

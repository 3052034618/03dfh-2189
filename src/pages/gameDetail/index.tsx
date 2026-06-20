import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import { useAppStore } from '@/store/appStore'
import { mockGames } from '@/data/games'
import { formatTime, formatCost, getStatusText } from '@/utils/format'
import styles from './index.module.scss'

const GameDetailPage: React.FC = () => {
  const { games, setGames, currentUser, joinGame, joinWaitlist } = useAppStore()
  const [gameId, setGameId] = useState('')

  useEffect(() => {
    const params = Taro.getCurrentInstance().router?.params
    const id = params?.id || 'g001'
    setGameId(id)
    if (games.length === 0) {
      setGames(mockGames)
    }
  }, [])

  const game = useMemo(() => {
    return games.find((g) => g.id === gameId) || mockGames[0]
  }, [games, gameId])

  const isFull = game.currentPlayers >= game.playerCount
  const isFinished = game.status === 'finished' || game.status === 'cancelled'
  const hasJoined = game.players.some((p) => p.id === currentUser.id)
  const isWaitlisted = game.waitlist.some((p) => p.id === currentUser.id)

  const emptySlots = game.playerCount - game.currentPlayers

  const handleJoin = () => {
    if (isFull) {
      joinWaitlist(gameId)
      Taro.showToast({ title: '已加入候补', icon: 'none' })
    } else {
      joinGame(gameId)
      Taro.showToast({ title: '报名成功！', icon: 'success' })
    }
  }

  const statusStyleMap: Record<string, string> = {
    recruiting: styles.statusRecruiting,
    locked: styles.statusLocked,
    playing: styles.statusPlaying,
    finished: styles.statusFinished
  }

  const getButtonText = () => {
    if (isFinished) return '已结束'
    if (hasJoined) return '已报名'
    if (isWaitlisted) return '已在候补'
    if (isFull) return `加入候补 (${game.waitlistCount + 1}号)`
    return '立即报名'
  }

  const getButtonStyle = () => {
    if (isFinished) return styles.joinBtnDisabled
    if (hasJoined || isWaitlisted) return styles.joinBtnDisabled
    if (isFull) return styles.joinBtnWaitlist
    return styles.joinBtnActive
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.scriptName}>{game.scriptName}</Text>
        <Text className={styles.gameTitle}>{game.title}</Text>
        <View className={styles.headerTags}>
          {game.tags.map((tag) => (
            <View key={tag} className={styles.headerTag}>
              <Text className={styles.headerTagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.infoCard}>
          <View className={styles.statusRow}>
            <View className={classnames(styles.statusBadge, statusStyleMap[game.status])}>
              <Text className={styles.statusText}>{getStatusText(game.status)}</Text>
            </View>
            <Text className={styles.circleTag}>{game.circleName}</Text>
          </View>
          <View className={styles.infoGrid}>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>预计花费</Text>
              <Text className={classnames(styles.infoValue, styles.infoValueHighlight)}>
                {formatCost(game.cost)}
              </Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>人数</Text>
              <Text className={styles.infoValue}>
                {game.currentPlayers}/{game.playerCount}人
              </Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>游戏时间</Text>
              <Text className={styles.infoValue}>{formatTime(game.gameTime)}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>旁听</Text>
              <Text className={styles.infoValue}>
                {game.allowSpectate ? '✅ 可以' : '❌ 不行'}
              </Text>
            </View>
            <View className={classnames(styles.infoItem, styles.infoItemWide)}>
              <Text className={styles.infoLabel}>📍 集合地点</Text>
              <Text className={styles.infoValue}>{game.location}</Text>
            </View>
          </View>
        </View>

        <View className={styles.descriptionCard}>
          <Text className={styles.descriptionTitle}>📝 备注</Text>
          <Text className={styles.descriptionText}>{game.description}</Text>
        </View>

        <View className={styles.playerSection}>
          <View className={styles.sectionTitleRow}>
            <Text className={styles.sectionTitle}>玩家列表</Text>
            <Text className={styles.sectionCount}>
              {game.currentPlayers}/{game.playerCount}
            </Text>
          </View>
          <View className={styles.playerList}>
            {game.players.map((player, idx) => (
              <View key={player.id} className={styles.playerItem}>
                <Image
                  className={styles.playerAvatar}
                  src={player.avatar}
                  mode="aspectFill"
                />
                <Text className={styles.playerName}>{player.name}</Text>
                {idx === 0 && <Text className={styles.organizerMark}>车头</Text>}
              </View>
            ))}
            {emptySlots > 0 &&
              Array.from({ length: emptySlots }).map((_, i) => (
                <View key={`empty-${i}`} className={styles.playerItem}>
                  <View className={styles.emptySlot}>
                    <Text className={styles.emptySlotText}>+</Text>
                  </View>
                  <Text className={styles.playerName}>空位</Text>
                </View>
              ))}
          </View>
        </View>

        {game.waitlist.length > 0 && (
          <View className={styles.waitlistSection}>
            <View className={styles.sectionTitleRow}>
              <Text className={styles.sectionTitle}>候补排队</Text>
              <Text className={styles.sectionCount}>{game.waitlistCount}人</Text>
            </View>
            {game.waitlist.map((player, idx) => (
              <View key={player.id} className={styles.waitlistItem}>
                <View className={styles.waitlistNumber}>
                  <Text className={styles.waitlistNumberText}>{idx + 1}</Text>
                </View>
                <Image
                  className={styles.waitlistAvatar}
                  src={player.avatar}
                  mode="aspectFill"
                />
                <Text className={styles.waitlistName}>{player.name}</Text>
                <Text className={styles.waitlistTime}>{formatTime(player.joinedAt)}</Text>
              </View>
            ))}
          </View>
        )}

        <View className={styles.organizerCard}>
          <Image
            className={styles.organizerAvatar}
            src={game.organizerAvatar}
            mode="aspectFill"
          />
          <View className={styles.organizerInfo}>
            <Text className={styles.organizerName}>{game.organizerName}</Text>
            <Text className={styles.organizerRole}>车头 · {game.circleName}</Text>
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View
          className={classnames(styles.joinBtn, getButtonStyle())}
          onClick={
            hasJoined || isWaitlisted || isFinished ? undefined : handleJoin
          }
        >
          <Text>{getButtonText()}</Text>
        </View>
      </View>
    </View>
  )
}

export default GameDetailPage

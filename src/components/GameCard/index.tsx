import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import type { Game } from '@/types/game'
import { formatTime, formatCost } from '@/utils/format'
import Tag from '@/components/Tag'
import StatusBadge from '@/components/StatusBadge'
import styles from './index.module.scss'

interface GameCardProps {
  game: Game
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const isFull = game.currentPlayers >= game.playerCount

  const handleClick = () => {
    Taro.navigateTo({ url: `/pages/gameDetail/index?id=${game.id}` })
  }

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.cardHeader}>
        <View className={styles.titleRow}>
          <Text className={styles.title}>{game.scriptName}</Text>
          <StatusBadge status={game.status} />
        </View>
        <Text className={styles.subtitle}>{game.title}</Text>
      </View>

      <View className={styles.tags}>
        {game.tags.map((tag) => (
          <Tag key={tag} text={tag} />
        ))}
      </View>

      <View className={styles.infoGrid}>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>花费</Text>
          <Text className={classnames(styles.infoValue, styles.costValue)}>
            {formatCost(game.cost)}
          </Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>人数</Text>
          <Text className={styles.infoValue}>
            {game.currentPlayers}/{game.playerCount}
          </Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>时间</Text>
          <Text className={styles.infoValue}>{formatTime(game.gameTime)}</Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>旁听</Text>
          <Text className={styles.infoValue}>
            {game.allowSpectate ? '可以' : '不行'}
          </Text>
        </View>
      </View>

      <View className={styles.cardFooter}>
        <View className={styles.organizer}>
          <Image className={styles.organizerAvatar} src={game.organizerAvatar} mode="aspectFill" />
          <Text className={styles.organizerName}>{game.organizerName}</Text>
          <Text className={styles.organizerLabel}>车头</Text>
        </View>
        <View className={styles.location}>
          <Text className={styles.locationIcon}>📍</Text>
          <Text className={styles.locationText}>{game.location}</Text>
        </View>
      </View>

      {isFull && game.waitlistCount > 0 && (
        <View className={styles.waitlistBanner}>
          <Text className={styles.waitlistText}>
            候补排队中 {game.waitlistCount} 人
          </Text>
        </View>
      )}
    </View>
  )
}

export default GameCard

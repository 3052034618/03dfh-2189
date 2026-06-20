import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, Image, Textarea } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import { useAppStore } from '@/store/appStore'
import type { ReviewPlayer } from '@/types/review'
import { formatTime } from '@/utils/format'
import styles from './index.module.scss'

type Preference = '阵营' | '情感' | '都喜欢' | '未标记'
const PREFERENCE_OPTIONS: Preference[] = ['阵营', '情感', '都喜欢']

const ReviewPage: React.FC = () => {
  const { games, reviews, addReview, currentUser } = useAppStore()

  const [reviewId, setReviewId] = useState<string>('')
  const [mode, setMode] = useState<'create' | 'detail'>('create')
  const [selectedGameId, setSelectedGameId] = useState<string>('')
  const [players, setPlayers] = useState<ReviewPlayer[]>([])
  const [comment, setComment] = useState('')

  useEffect(() => {
    const params = Taro.getCurrentInstance().router?.params || {}
    if (params.reviewId) {
      setReviewId(params.reviewId)
      setMode('detail')
    } else {
      setMode('create')
    }
  }, [])

  const selectedReview = useMemo(() => {
    if (mode !== 'detail') return null
    return reviews.find((r) => r.id === reviewId)
  }, [mode, reviewId, reviews])

  const availableGames = useMemo(() => {
    return games.filter((g) =>
      g.players.some((p) => p.id === currentUser.id) ||
      g.organizerId === currentUser.id ||
      g.status === 'locked' ||
      g.status === 'finished'
    )
  }, [games, currentUser.id])

  const selectedGame = useMemo(() => {
    return games.find((g) => g.id === selectedGameId)
  }, [games, selectedGameId])

  useEffect(() => {
    if (mode !== 'create') return
    if (!selectedGameId && availableGames.length > 0) {
      setSelectedGameId(availableGames[0].id)
    }
  }, [mode, availableGames, selectedGameId])

  useEffect(() => {
    if (mode !== 'create' || !selectedGame) return
    const initPlayers: ReviewPlayer[] = selectedGame.players.map((p) => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      isNoShow: false,
      isRecommendDM: false,
      preference: '未标记' as const
    }))
    setPlayers(initPlayers)
  }, [mode, selectedGame])

  useEffect(() => {
    if (!selectedReview) return
    setPlayers(selectedReview.players.map((p) => ({ ...p })))
    setComment(selectedReview.overallComment)
  }, [selectedReview])

  const toggleNoShow = (playerId: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, isNoShow: !p.isNoShow } : p))
    )
  }

  const toggleRecommendDM = (playerId: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, isRecommendDM: !p.isRecommendDM } : p))
    )
  }

  const setPreference = (playerId: string, pref: Preference) => {
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id !== playerId) return p
        return { ...p, preference: p.preference === pref ? '未标记' : pref }
      })
    )
  }

  const handleSubmit = () => {
    if (!selectedGame) {
      Taro.showToast({ title: '请选择要复盘的局', icon: 'none' })
      return
    }
    if (players.length === 0) {
      Taro.showToast({ title: '没有可复盘的成员', icon: 'none' })
      return
    }

    addReview({
      gameId: selectedGame.id,
      gameTitle: selectedGame.title,
      scriptName: selectedGame.scriptName,
      circleName: selectedGame.circleName,
      gameTime: selectedGame.gameTime,
      players: players,
      overallComment: comment.trim()
    })

    Taro.showToast({ title: '复盘已保存！', icon: 'success' })
    setTimeout(() => {
      Taro.navigateBack()
    }, 1200)
  }

  if (mode === 'detail' && selectedReview) {
    const noShowCount = selectedReview.players.filter((p) => p.isNoShow).length
    const dmCount = selectedReview.players.filter((p) => p.isRecommendDM).length
    const campCount = selectedReview.players.filter(
      (p) => p.preference === '阵营' || p.preference === '都喜欢'
    ).length
    const emotionCount = selectedReview.players.filter(
      (p) => p.preference === '情感' || p.preference === '都喜欢'
    ).length

    return (
      <View className={styles.page}>
        <View className={styles.header}>
          <Text className={styles.headerTitle}>📝 复盘详情</Text>
          <Text className={styles.headerSubtitle}>{selectedReview.gameTitle}</Text>
        </View>

        <View className={styles.content}>
          <View className={styles.card}>
            <Text className={styles.sectionTitle}>{selectedReview.scriptName}</Text>
            <View style={{ fontSize: 28, color: '#4E5969', marginBottom: 24 }}>
              <Text>{selectedReview.circleName} · </Text>
              <Text>{formatTime(selectedReview.gameTime)}</Text>
            </View>
            <View className={styles.detailOverview}>
              <View className={styles.detailOverviewItem}>
                <Text className={styles.detailOverviewNumber} style={{ color: '#1D2129' }}>
                  {selectedReview.players.length}
                </Text>
                <Text className={styles.detailOverviewLabel}>参与人数</Text>
              </View>
              <View className={styles.detailOverviewItem}>
                <Text className={styles.detailOverviewNumber} style={{ color: '#F53F3F' }}>
                  {noShowCount}
                </Text>
                <Text className={styles.detailOverviewLabel}>🕊️ 鸽子</Text>
              </View>
              <View className={styles.detailOverviewItem}>
                <Text className={styles.detailOverviewNumber} style={{ color: '#00B42A' }}>
                  {dmCount}
                </Text>
                <Text className={styles.detailOverviewLabel}>🎤 推荐DM</Text>
              </View>
              <View className={styles.detailOverviewItem}>
                <Text className={styles.detailOverviewNumber} style={{ color: '#6C5CE7' }}>
                  {campCount}/{emotionCount}
                </Text>
                <Text className={styles.detailOverviewLabel}>阵营/情感</Text>
              </View>
            </View>

            {selectedReview.players.map((p) => (
              <View key={p.id} className={styles.playerRow}>
                <Image className={styles.playerAvatar} src={p.avatar} mode="aspectFill" />
                <View className={styles.playerMain}>
                  <Text className={styles.playerName}>{p.name}</Text>
                  <View className={styles.playerBadges}>
                    {p.isNoShow && (
                      <View className={classnames(styles.playerBadge, styles.playerBadgeDanger)}>
                        <Text className={classnames(styles.playerBadgeText, styles.playerBadgeTextDanger)}>
                          🕊️ 鸽子
                        </Text>
                      </View>
                    )}
                    {p.isRecommendDM && (
                      <View className={classnames(styles.playerBadge, styles.playerBadgeSuccess)}>
                        <Text className={classnames(styles.playerBadgeText, styles.playerBadgeTextSuccess)}>
                          🎤 推荐DM
                        </Text>
                      </View>
                    )}
                  </View>
                  {p.preference !== '未标记' && (
                    <View className={styles.preferenceRow}>
                      <View className={styles.preferenceTag}>
                        <Text className={styles.preferenceTagText}>偏：{p.preference}</Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>

          {selectedReview.overallComment && (
            <View className={styles.card}>
              <View className={styles.detailCommentCard}>
                <Text className={styles.detailCommentLabel}>💬 整体评价</Text>
                <Text className={styles.detailCommentText}>{selectedReview.overallComment}</Text>
              </View>
            </View>
          )}

          <View style={{ height: 32 }} />
        </View>
      </View>
    )
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>📝 写复盘</Text>
        <Text className={styles.headerSubtitle}>记录本局情况，方便下次更好约本</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.card}>
          <Text className={styles.sectionTitle}>选择要复盘的局</Text>
          <View className={styles.gameSelectWrap}>
            {availableGames.length === 0 ? (
              <View
                style={{
                  padding: 32,
                  textAlign: 'center',
                  backgroundColor: '#F5F6F7',
                  borderRadius: 12,
                  color: '#86909C',
                  fontSize: 28
                }}
              >
                暂无参与过的局，先去报名吧～
              </View>
            ) : (
              availableGames.map((g) => (
                <View
                  key={g.id}
                  className={classnames(
                    styles.gameSelectOption,
                    selectedGameId === g.id && styles.gameSelectOptionSelected
                  )}
                  onClick={() => setSelectedGameId(g.id)}
                >
                  <View className={styles.gameSelectOptionInfo}>
                    <Text className={styles.gameSelectOptionName}>{g.scriptName}</Text>
                    <Text className={styles.gameSelectOptionMeta}>
                      {g.circleName} · {formatTime(g.gameTime)} · {g.players.length}人
                    </Text>
                  </View>
                  {selectedGameId === g.id && (
                    <Text className={styles.gameSelectOptionCheck}>✓</Text>
                  )}
                </View>
              ))
            )}
          </View>
        </View>

        {players.length > 0 && (
          <View className={styles.card}>
            <Text className={styles.sectionTitle}>
              本局成员（标记鸽子/推荐DM/偏好）
            </Text>
            {players.map((player) => (
              <View key={player.id} className={styles.playerRow}>
                <Image
                  className={styles.playerAvatar}
                  src={player.avatar}
                  mode="aspectFill"
                />
                <View className={styles.playerMain}>
                  <Text className={styles.playerName}>{player.name}</Text>
                  <View className={styles.playerBadges}>
                    {player.isNoShow && (
                      <View className={classnames(styles.playerBadge, styles.playerBadgeDanger)}>
                        <Text
                          className={classnames(
                            styles.playerBadgeText,
                            styles.playerBadgeTextDanger
                          )}
                        >
                          🕊️ 鸽子
                        </Text>
                      </View>
                    )}
                    {player.isRecommendDM && (
                      <View className={classnames(styles.playerBadge, styles.playerBadgeSuccess)}>
                        <Text
                          className={classnames(
                            styles.playerBadgeText,
                            styles.playerBadgeTextSuccess
                          )}
                        >
                          🎤 推荐DM
                        </Text>
                      </View>
                    )}
                    {player.preference !== '未标记' && (
                      <View className={styles.preferenceTag}>
                        <Text className={styles.preferenceTagText}>偏：{player.preference}</Text>
                      </View>
                    )}
                  </View>
                  <View className={styles.actionRow}>
                    {PREFERENCE_OPTIONS.map((pref) => (
                      <View
                        key={pref}
                        className={classnames(
                          styles.actionBtn,
                          player.preference === pref && styles.actionBtnActive
                        )}
                        onClick={() => setPreference(player.id, pref)}
                      >
                        <Text
                          className={classnames(
                            styles.actionBtnText,
                            player.preference === pref && styles.actionBtnTextActive
                          )}
                        >
                          {pref}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View className={styles.playerActions}>
                  <View
                    className={classnames(
                      styles.actionBtn,
                      styles.actionBtnDanger,
                      player.isNoShow && styles.actionBtnActive
                    )}
                    onClick={() => toggleNoShow(player.id)}
                  >
                    <Text
                      className={classnames(
                        styles.actionBtnText,
                        player.isNoShow && styles.actionBtnTextDangerActive
                      )}
                    >
                      鸽子
                    </Text>
                  </View>
                  <View
                    className={classnames(
                      styles.actionBtn,
                      styles.actionBtnSuccess,
                      player.isRecommendDM && styles.actionBtnActive
                    )}
                    onClick={() => toggleRecommendDM(player.id)}
                  >
                    <Text
                      className={classnames(
                        styles.actionBtnText,
                        player.isRecommendDM && styles.actionBtnTextSuccessActive
                      )}
                    >
                      DM
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {players.length > 0 && (
          <View className={styles.card}>
            <Text className={styles.sectionTitle}>整体评价（可选）</Text>
            <View className={styles.commentWrap}>
              <Textarea
                className={styles.commentTextArea}
                placeholder="总结一下本场体验，谁是戏精、谁逻辑清晰、下次玩什么类型好..."
                value={comment}
                onInput={(e) => setComment(e.detail.value)}
                maxlength={300}
              />
            </View>
          </View>
        )}
      </View>

      <View className={styles.bottomBar}>
        <View
          className={classnames(
            styles.submitBtn,
            players.length === 0 && styles.submitBtnDisabled
          )}
          onClick={players.length > 0 ? handleSubmit : undefined}
        >
          <Text>保存复盘</Text>
        </View>
      </View>
    </View>
  )
}

export default ReviewPage

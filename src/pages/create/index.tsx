import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, Input, Textarea } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import { useAppStore } from '@/store/appStore'
import { mockCircles } from '@/data/circles'
import type { ScriptTag } from '@/types/game'
import styles from './index.module.scss'

const SCRIPT_TAGS: ScriptTag[] = ['新手', '欢乐', '硬核', '情感', '阵营', '恐怖', '机制', '推理']

const CreatePage: React.FC = () => {
  const { circles, setCircles, addGame } = useAppStore()

  useEffect(() => {
    if (circles.length === 0) {
      setCircles(mockCircles)
    }
  }, [])

  const myCircles = useMemo(() => circles.filter((c) => c.isJoined), [circles])

  const [scriptName, setScriptName] = useState('')
  const [title, setTitle] = useState('')
  const [selectedTags, setSelectedTags] = useState<ScriptTag[]>([])
  const [selectedCircle, setSelectedCircle] = useState('')
  const [playerCount, setPlayerCount] = useState('6')
  const [cost, setCost] = useState('40')
  const [location, setLocation] = useState('')
  const [gameTime, setGameTime] = useState('')
  const [allowSpectate, setAllowSpectate] = useState(true)
  const [description, setDescription] = useState('')

  const toggleTag = (tag: ScriptTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const toggleSpectate = () => {
    setAllowSpectate(!allowSpectate)
  }

  const handleGoCreateCircle = () => {
    Taro.switchTab({ url: '/pages/circles/index' })
  }

  const handleSubmit = () => {
    if (!scriptName.trim()) {
      Taro.showToast({ title: '请填写剧本名', icon: 'none' })
      return
    }
    if (myCircles.length === 0) {
      Taro.showModal({
        title: '还没有加入车圈',
        content: '请先去车圈页面创建或加入车圈后再发车',
        showCancel: true,
        confirmText: '去创建',
        success: (res) => {
          if (res.confirm) handleGoCreateCircle()
        }
      })
      return
    }
    if (!selectedCircle) {
      Taro.showToast({ title: '请选择车圈', icon: 'none' })
      return
    }
    if (!location.trim()) {
      Taro.showToast({ title: '请填写集合地点', icon: 'none' })
      return
    }

    const circleObj = myCircles.find((c) => c.id === selectedCircle)

    addGame({
      title: title.trim(),
      scriptName: scriptName.trim(),
      tags: selectedTags,
      circleId: selectedCircle,
      circleName: circleObj?.name || '',
      playerCount: parseInt(playerCount) || 6,
      cost: parseFloat(cost) || 0,
      location: location.trim(),
      gameTime: gameTime.trim(),
      allowSpectate,
      description: description.trim()
    })

    Taro.showToast({ title: '发车成功！', icon: 'success' })
    setTimeout(() => {
      Taro.switchTab({ url: '/pages/home/index' })
    }, 1200)
  }

  const handleDraft = () => {
    Taro.showToast({ title: '已存为草稿', icon: 'none' })
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>🚗 发车</Text>
        <Text className={styles.headerSubtitle}>选好圈子，定向约本</Text>
      </View>

      <View className={styles.form}>
        <View className={styles.formCard}>
          <Text className={styles.formLabel}>
            剧本名<Text className={styles.formRequired}>*</Text>
          </Text>
          <View className={styles.inputWrap}>
            <Input
              className={styles.input}
              placeholder="输入剧本名称"
              value={scriptName}
              onInput={(e) => setScriptName(e.detail.value)}
            />
          </View>

          <Text className={styles.formLabel}>车名</Text>
          <View className={styles.inputWrap}>
            <Input
              className={styles.input}
              placeholder="给这车起个名，如：考后解压车"
              value={title}
              onInput={(e) => setTitle(e.detail.value)}
            />
          </View>

          <Text className={styles.formLabel}>剧本标签</Text>
          <View className={styles.tagGroup}>
            {SCRIPT_TAGS.map((tag) => (
              <View
                key={tag}
                className={classnames(
                  styles.tagOption,
                  selectedTags.includes(tag) && styles.tagOptionSelected
                )}
                onClick={() => toggleTag(tag)}
              >
                <Text
                  className={classnames(
                    styles.tagOptionText,
                    selectedTags.includes(tag) && styles.tagOptionTextSelected
                  )}
                >
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formCard}>
          <Text className={styles.formLabel}>
            选择车圈<Text className={styles.formRequired}>*</Text>
          </Text>

          {myCircles.length === 0 ? (
            <View className={styles.noCirclesCard}>
              <Text className={styles.noCirclesIcon}>🎭</Text>
              <Text className={styles.noCirclesTitle}>还没有加入车圈</Text>
              <Text className={styles.noCirclesDesc}>
                加入车圈后才能定向约本，避免大群公开抢名额
              </Text>
              <View className={styles.goCreateBtn} onClick={handleGoCreateCircle}>
                <Text className={styles.goCreateBtnText}>去创建车圈</Text>
              </View>
            </View>
          ) : (
            myCircles.map((circle) => (
              <View
                key={circle.id}
                className={classnames(
                  styles.circleOption,
                  selectedCircle === circle.id && styles.circleOptionSelected
                )}
                onClick={() => setSelectedCircle(circle.id)}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    className={classnames(
                      styles.circleOptionName,
                      selectedCircle === circle.id && styles.circleOptionNameSelected
                    )}
                  >
                    {circle.name}
                  </Text>
                  <Text className={styles.circleOptionDesc}>
                    {circle.category} · {circle.memberCount}人
                  </Text>
                </View>
                {selectedCircle === circle.id && (
                  <Text className={styles.circleOptionCheck}>✓</Text>
                )}
              </View>
            ))
          )}
        </View>

        <View className={styles.formCard}>
          <Text className={styles.formLabel}>人数</Text>
          <View className={styles.inputWrap}>
            <Input
              className={styles.input}
              type="number"
              placeholder="需要几人"
              value={playerCount}
              onInput={(e) => setPlayerCount(e.detail.value)}
            />
          </View>

          <Text className={styles.formLabel}>预计花费（元/人）</Text>
          <View className={styles.inputWrap}>
            <Input
              className={styles.input}
              type="digit"
              placeholder="0表示免费"
              value={cost}
              onInput={(e) => setCost(e.detail.value)}
            />
          </View>

          <Text className={styles.formLabel}>
            集合地点<Text className={styles.formRequired}>*</Text>
          </Text>
          <View className={styles.inputWrap}>
            <Input
              className={styles.input}
              placeholder="如：梅园3号楼 活动室A"
              value={location}
              onInput={(e) => setLocation(e.detail.value)}
            />
          </View>

          <Text className={styles.formLabel}>游戏时间</Text>
          <View className={styles.inputWrap}>
            <Input
              className={styles.input}
              placeholder="如：6月22日 周日 14:00"
              value={gameTime}
              onInput={(e) => setGameTime(e.detail.value)}
            />
          </View>

          <View className={styles.toggleRow}>
            <View>
              <Text className={styles.toggleLabel}>允许旁听</Text>
              <Text className={styles.toggleDesc}>其他同学可以来旁观学习</Text>
            </View>
            <View
              className={classnames(styles.toggle, allowSpectate && styles.toggleOn)}
              onClick={toggleSpectate}
            >
              <View
                className={classnames(
                  styles.toggleThumb,
                  allowSpectate && styles.toggleThumbOn
                )}
              />
            </View>
          </View>
        </View>

        <View className={styles.formCard}>
          <Text className={styles.formLabel}>备注说明</Text>
          <View className={styles.textAreaWrap}>
            <Textarea
              className={styles.textArea}
              placeholder="补充说明，如：新手友好、老手带飞～"
              value={description}
              onInput={(e) => setDescription(e.detail.value)}
              maxlength={200}
            />
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.draftBtn} onClick={handleDraft}>
          <Text>存草稿</Text>
        </View>
        <View className={styles.submitBtn} onClick={handleSubmit}>
          <Text>发车</Text>
        </View>
      </View>
    </View>
  )
}

export default CreatePage

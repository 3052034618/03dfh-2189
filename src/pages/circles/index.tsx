import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Image, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import { useAppStore } from '@/store/appStore'
import { mockCircles } from '@/data/circles'
import CircleCard from '@/components/CircleCard'
import EmptyState from '@/components/EmptyState'
import Modal from '@/components/Modal'
import type { CircleCategory } from '@/types/circle'
import styles from './index.module.scss'

const CATEGORY_TABS = ['全部', '宿舍', '年级', '熟悉度', '类型']
const CATEGORY_OPTIONS: CircleCategory[] = ['宿舍', '年级', '熟悉度', '类型']
const CATEGORY_ICONS: Record<string, string> = {
  宿舍: '🏠',
  年级: '🎓',
  熟悉度: '🤝',
  类型: '🎭'
}
const PRESET_TAGS = ['新手', '欢乐', '硬核', '情感', '阵营', '推理', '机制', '恐怖']

const CirclesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('全部')
  const { circles, setCircles, addCircle } = useAppStore()
  const [modalVisible, setModalVisible] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newCategory, setNewCategory] = useState<CircleCategory>('类型')
  const [newTags, setNewTags] = useState<string[]>([])

  useEffect(() => {
    if (circles.length === 0) {
      setCircles(mockCircles)
    }
  }, [])

  const myCircles = circles.filter((c) => c.isJoined)

  const filteredCircles = circles.filter((c) => {
    if (activeCategory === '全部') return true
    return c.category === activeCategory
  })

  const handleToggleTag = (tag: string) => {
    setNewTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleCreateClick = () => {
    setModalVisible(true)
    setNewName('')
    setNewDesc('')
    setNewCategory('类型')
    setNewTags([])
  }

  const handleSubmitCreate = () => {
    if (!newName.trim()) {
      Taro.showToast({ title: '请填写车圈名', icon: 'none' })
      return
    }

    addCircle({
      name: newName.trim(),
      description: newDesc.trim() || `${newCategory}的熟人约本车圈`,
      category: newCategory,
      tags: newTags.length > 0 ? newTags : ['欢乐']
    })

    Taro.showToast({ title: '创建成功！', icon: 'success' })
    setModalVisible(false)
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

      <View className={styles.createBtn} onClick={handleCreateClick}>
        <Text className={styles.createBtnText}>+</Text>
      </View>

      <Modal
        visible={modalVisible}
        title="创建私密车圈"
        onClose={() => setModalVisible(false)}
      >
        <Text className={styles.createLabel}>
          车圈名称<Text style={{ color: '#f53f3f' }}>*</Text>
        </Text>
        <View className={styles.createInputWrap}>
          <Input
            className={styles.createInput}
            placeholder="如：梅园3号楼车圈"
            value={newName}
            onInput={(e) => setNewName(e.detail.value)}
            maxlength={20}
          />
        </View>

        <Text className={styles.createLabel}>分组类型</Text>
        <View className={styles.createOptionRow}>
          {CATEGORY_OPTIONS.map((cat) => (
            <View
              key={cat}
              className={classnames(
                styles.createOption,
                newCategory === cat && styles.createOptionSelected
              )}
              onClick={() => setNewCategory(cat)}
            >
              <Text
                className={classnames(
                  styles.createOptionIcon,
                  newCategory === cat && styles.createOptionIconSelected
                )}
              >
                {CATEGORY_ICONS[cat]}
              </Text>
              <Text
                className={classnames(
                  styles.createOptionText,
                  newCategory === cat && styles.createOptionTextSelected
                )}
              >
                {cat}
              </Text>
            </View>
          ))}
        </View>

        <Text className={styles.createLabel}>常玩类型（可多选）</Text>
        <View className={styles.createTagGroup}>
          {PRESET_TAGS.map((tag) => (
            <View
              key={tag}
              className={classnames(
                styles.createTag,
                newTags.includes(tag) && styles.createTagSelected
              )}
              onClick={() => handleToggleTag(tag)}
            >
              <Text
                className={classnames(
                  styles.createTagText,
                  newTags.includes(tag) && styles.createTagTextSelected
                )}
              >
                {tag}
              </Text>
            </View>
          ))}
        </View>

        <Text className={styles.createLabel}>车圈简介</Text>
        <View className={styles.createInputWrap}>
          <Input
            className={styles.createInput}
            placeholder="介绍一下这个车圈..."
            value={newDesc}
            onInput={(e) => setNewDesc(e.detail.value)}
            maxlength={50}
          />
        </View>

        <View className={styles.createBtnRow}>
          <View
            className={styles.createCancelBtn}
            onClick={() => setModalVisible(false)}
          >
            <Text className={styles.createCancelBtnText}>取消</Text>
          </View>
          <View className={styles.createSubmitBtn} onClick={handleSubmitCreate}>
            <Text className={styles.createSubmitBtnText}>创建</Text>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default CirclesPage

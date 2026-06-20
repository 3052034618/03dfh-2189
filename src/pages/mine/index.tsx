import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useAppStore } from '@/store/appStore'
import Tag from '@/components/Tag'
import styles from './index.module.scss'

const MENU_ITEMS = [
  { icon: '📋', text: '我的报名', url: '/pages/gameDetail/index' },
  { icon: '🎭', text: '我的车圈', url: '/pages/circleDetail/index' },
  { icon: '📝', text: '我的复盘', url: '/pages/review/index' },
  { icon: '⭐', text: '收藏的剧本', url: '/pages/gameDetail/index' },
  { icon: '📢', text: '通知设置', url: '/pages/gameDetail/index' },
  { icon: '⚙️', text: '设置', url: '/pages/gameDetail/index' }
]

const MinePage: React.FC = () => {
  const { currentUser } = useAppStore()

  const handleMenuClick = (url: string) => {
    Taro.navigateTo({ url })
  }

  return (
    <View className={styles.page}>
      <View className={styles.profileCard}>
        <Image
          className={styles.avatar}
          src={currentUser.avatar}
          mode="aspectFill"
        />
        <View className={styles.profileInfo}>
          <Text className={styles.profileName}>{currentUser.name}</Text>
          <Text className={styles.profileMeta}>
            {currentUser.grade} · {currentUser.dorm}
          </Text>
        </View>
        <View className={styles.profileEdit}>
          <Text className={styles.profileEditText}>编辑</Text>
        </View>
      </View>

      <View className={styles.statsRow}>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{currentUser.gameCount}</Text>
          <Text className={styles.statLabel}>参与场次</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{currentUser.dmCount}</Text>
          <Text className={styles.statLabel}>DM次数</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{currentUser.circleCount}</Text>
          <Text className={styles.statLabel}>加入车圈</Text>
        </View>
      </View>

      <View className={styles.preferences}>
        <Text className={styles.preferencesTitle}>我的偏好</Text>
        <View className={styles.preferencesCard}>
          <View className={styles.preferenceTags}>
            {currentUser.preferences.map((pref) => (
              <View key={pref} className={styles.preferenceTag}>
                <Text className={styles.preferenceTagText}>{pref}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.menuSection}>
        <Text className={styles.menuTitle}>功能</Text>
        <View className={styles.menuCard}>
          {MENU_ITEMS.map((item) => (
            <View
              key={item.text}
              className={styles.menuItem}
              onClick={() => handleMenuClick(item.url)}
            >
              <Text className={styles.menuItemIcon}>{item.icon}</Text>
              <Text className={styles.menuItemText}>{item.text}</Text>
              <Text className={styles.menuItemArrow}>›</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

export default MinePage

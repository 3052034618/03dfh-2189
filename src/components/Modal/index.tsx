import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.scss'

interface ModalProps {
  visible: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
  showClose?: boolean
}

const Modal: React.FC<ModalProps> = ({ visible, title, onClose, children, showClose = true }) => {
  if (!visible) return null

  return (
    <View className={styles.mask} onClick={onClose}>
      <View className={styles.container} onClick={(e) => e.stopPropagation()}>
        <View className={styles.header}>
          <Text className={styles.title}>{title}</Text>
          {showClose && (
            <View className={styles.closeBtn} onClick={onClose}>
              <Text className={styles.closeText}>✕</Text>
            </View>
          )}
        </View>
        <View className={styles.body}>{children}</View>
      </View>
    </View>
  )
}

export default Modal

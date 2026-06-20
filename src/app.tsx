import React, { useEffect } from 'react'
import { useDidShow, useDidHide } from '@tarojs/taro'
import { useAppStore } from '@/store/appStore'
import { mockGames } from '@/data/games'
import { mockCircles } from '@/data/circles'
import { mockReviews } from '@/data/reviews'
import './app.scss'

function App(props) {
  const {
    games,
    circles,
    reviews,
    setGames,
    setCircles,
    setReviews
  } = useAppStore()

  useEffect(() => {
    if (games.length === 0) setGames(mockGames)
    if (circles.length === 0) setCircles(mockCircles)
    if (reviews.length === 0) setReviews(mockReviews)
  }, [])

  useDidShow(() => {})
  useDidHide(() => {})

  return props.children
}

export default App

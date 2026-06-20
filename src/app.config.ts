export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/circles/index',
    'pages/create/index',
    'pages/mine/index',
    'pages/gameDetail/index',
    'pages/circleDetail/index',
    'pages/review/index',
    'pages/reviewList/index',
    'pages/memberDetail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#F7F5FF',
    navigationBarTitleText: '约本车',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#86909c',
    selectedColor: '#6C5CE7',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '约本'
      },
      {
        pagePath: 'pages/circles/index',
        text: '车圈'
      },
      {
        pagePath: 'pages/create/index',
        text: '发车'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})

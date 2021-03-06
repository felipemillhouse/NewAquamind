import React, { useEffect, useRef } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import {
  Linking,
  Platform,
  StatusBar,
  UIManager,
  LogBox,
  AppState,
  AppStateStatus,
} from 'react-native'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import * as Notifications from 'expo-notifications'
import { NavigationContainer } from '@react-navigation/native'
import { Provider as PaperProvider, configureFonts } from 'react-native-paper'
import {
  useFonts,
  Roboto_100Thin,
  Roboto_100Thin_Italic,
  Roboto_900Black_Italic,
  Roboto_900Black,
  Roboto_700Bold_Italic,
  Roboto_700Bold,
  Roboto_500Medium_Italic,
  Roboto_500Medium,
  Roboto_400Regular_Italic,
  Roboto_300Light_Italic,
  Roboto_300Light,
  Roboto_400Regular,
} from '@expo-google-fonts/roboto'
import AppLoading from 'expo-app-loading'
import { QueryClient, QueryClientProvider } from 'react-query'

import Spinner from './view/components/loading'
import Alert from './view/components/alert'
import Drawer from './view/components/drawer'
import { store, persistor } from './store'
import FeedRTK from './store/feed'
import ConfigRTK from './store/config'
import { getAllFeed } from './API/feed'
import theme from './theme'
import Routes from './routes'

const myTheme = {
  ...theme,
  fonts: configureFonts({ default: { ...theme.fonts } }),
}

const App: React.FC = () => {
  const appState = useRef(AppState.currentState)

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 2 } },
  })
  if (__DEV__) {
    import('react-query-native-devtools').then(({ addPlugin }) => {
      addPlugin({ queryClient })
    })
  }

  const fetchFeed = async () => {
    store.dispatch(ConfigRTK.actions.setFeedCursor(0))
    store.dispatch(ConfigRTK.actions.setFeedLoading(true))
    const response = await getAllFeed({ take: 10, cursor: 0 })

    if (!response || 'statusCode' in response) {
      store.dispatch(ConfigRTK.actions.setFeedLoading(false))
      return
    }

    if (response) {
      store.dispatch(FeedRTK.actions.setFeed(response))
      if (response.length) {
        store.dispatch(ConfigRTK.actions.setFeedCursor(response[response.length - 1].id))
      }
    }
    store.dispatch(ConfigRTK.actions.setFeedLoading(false))
  }

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        fetchFeed()
      }
      appState.current = nextAppState
    }

    const appStateListener = AppState.addEventListener('change', handleAppStateChange)

    return () => {
      appStateListener.remove()
    }
  }, [])

  LogBox.ignoreLogs([
    'new NativeEventEmitter',
    "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
    'Warning: Cannot update a component (`Routes`)',
    'Warning: Cannot update a component (`FeedView`)',
  ])

  // it's for LayoutAnimation used on swipeList works
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
  }

  // React navigation notification handler
  const linking = {
    prefixes: ['aquamindapp://'],
    // Custom function to get the URL which was used to open the app
    async getInitialURL() {
      // First, you may want to do the default deep link handling
      // Check if app was opened from a deep link
      const defaultUrl = await Linking.getInitialURL()
      if (defaultUrl != null) {
        return defaultUrl
      }
      // Handle URL from expo push notifications
      const response = await Notifications.getLastNotificationResponseAsync()
      const url = response?.notification.request.content.data.url
      return url
    },
    // Custom function to subscribe to incoming links
    subscribe(listener: any) {
      // First, you may want to do the default deep link handling
      const onReceiveURL = ({ url }: { url: string }) => listener(url)
      // Listen to incoming links from deep linking
      const myListener = Linking.addEventListener('url', onReceiveURL)
      // Listen to expo push notifications
      const subscription = Notifications.addNotificationResponseReceivedListener(response => {
        const url = response.notification.request.content.data.url
        // Any custom logic to see whether the URL needs to be handled
        //...
        // Let React Navigation handle the URL
        listener(url)
      })
      return () => {
        // Clean up the event listeners
        if (myListener) {
          myListener.remove()
        }
        if (subscription) {
          subscription.remove()
        }
      }
    },
  }

  const [isReady] = useFonts({
    Roboto_100Thin,
    Roboto_100Thin_Italic,
    Roboto_900Black_Italic,
    Roboto_900Black,
    Roboto_700Bold_Italic,
    Roboto_700Bold,
    Roboto_500Medium_Italic,
    Roboto_500Medium,
    Roboto_400Regular_Italic,
    Roboto_300Light_Italic,
    Roboto_300Light,
    Roboto_400Regular,
  })

  if (!isReady) {
    return <AppLoading />
  }

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PaperProvider theme={myTheme}>
          <QueryClientProvider client={queryClient}>
            <NavigationContainer
              linking={{
                ...linking,
                config: {
                  screens: {
                    Tabs: {
                      screens: {
                        FeedTab: {
                          screens: {
                            PostDetail: {
                              path: 'likePostComment/:postId/:commentId?',
                              parse: {
                                postId: Number,
                                commentId: Number,
                              },
                              exact: true,
                            },
                          },
                        },
                      },
                    },
                    Auth: {
                      screens: {
                        ValidateEmail: {
                          path: 'validateEmail/:token',
                          exact: true,
                        },
                        ResetPassword: {
                          path: 'resetPassword/:token',
                          exact: true,
                        },
                        Login: {
                          path: 'login',
                          exact: true,
                        },
                        CreateAccount: {
                          path: 'createAccount',
                          exact: true,
                        },
                      },
                    },
                  },
                },
              }}
            >
              <PersistGate loading={<AppLoading />} persistor={persistor}>
                <StatusBar barStyle="light-content" />
                <Routes />
                <Drawer />
                <Alert />
                <Spinner />
              </PersistGate>
            </NavigationContainer>
          </QueryClientProvider>
        </PaperProvider>
      </Provider>
    </GestureHandlerRootView>
  )
}

export default App

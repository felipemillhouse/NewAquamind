import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useSelector, useDispatch } from 'react-redux'
import { IconButton } from 'react-native-paper'

import { RootState } from '../store/rootReducer'
import Login from '../view/login'
import CreateAccount from '../view/createAccount'
import ForgotPassword from '../view/forgotPassword'
import FeedView from '../view/feed'
import TankView from '../view/tank'
import ConfigRTK from '../store/config'
import theme from '../theme'
import {
  ParamListRootStack,
  ParamListTabStack,
  ParamListAuthStack,
  ParamListFeedStack,
  ParamListTankStack,
} from './types'

const RootStack = createNativeStackNavigator<ParamListRootStack>()
const AuthStack = createNativeStackNavigator<ParamListAuthStack>()
const FeedStack = createNativeStackNavigator<ParamListFeedStack>()
const TankStack = createNativeStackNavigator<ParamListTankStack>()
const Tab = createBottomTabNavigator<ParamListTabStack>()

const Auth: React.FC = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
    initialRouteName="Login"
  >
    <AuthStack.Screen name="Login" component={Login} />
    <AuthStack.Screen name="CreateAccount" component={CreateAccount} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
  </AuthStack.Navigator>
)
const Feed: React.FC = () => {
  const dispatch = useDispatch()

  return (
    <FeedStack.Navigator
      initialRouteName="Feed"
      screenOptions={{
        headerTintColor: theme.colors.surface,
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
      }}
    >
      <FeedStack.Screen
        name="Feed"
        component={FeedView}
        options={{
          headerRight: () => (
            <IconButton
              icon="menu"
              color={theme.colors.surface}
              onPress={() => dispatch(ConfigRTK.actions.showDrawer(true))}
              hasTVPreferredFocus={undefined}
              tvParallaxProperties={undefined}
            />
          ),
        }}
      />
    </FeedStack.Navigator>
  )
}
const Tank: React.FC = () => (
  <TankStack.Navigator
    initialRouteName="Tank"
    screenOptions={{
      headerTintColor: theme.colors.surface,
      headerStyle: {
        backgroundColor: theme.colors.primary,
      },
    }}
  >
    <TankStack.Screen name="Tank" component={TankView} />
  </TankStack.Navigator>
)

const Tabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveBackgroundColor: theme.colors.background,
      tabBarInactiveBackgroundColor: theme.colors.background,
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: theme.colors.background,
      },
    }}
    initialRouteName="FeedTab"
  >
    <Tab.Screen
      name="FeedTab"
      component={Feed}
      options={{
        tabBarLabel: 'Feed',
        tabBarIcon: ({ focused }) => (
          <MaterialCommunityIcons
            name={focused ? 'image-multiple' : 'image-multiple-outline'}
            color={theme.colors.primary}
            size={focused ? 24 : 22}
          />
        ),
      }}
    />
    <Tab.Screen
      name="TankTab"
      component={Tank}
      options={{
        tabBarLabel: 'My Tank',
        tabBarIcon: ({ focused }) => (
          <MaterialCommunityIcons
            name={focused ? 'fishbowl' : 'fishbowl-outline'}
            color={theme.colors.primary}
            size={24}
          />
        ),
      }}
    />
  </Tab.Navigator>
)

const Routes: React.FC = () => {
  const { config } = useSelector((state: RootState) => state)
  const { authenticated } = config

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {authenticated ? (
        <RootStack.Screen name="Tabs" component={Tabs} />
      ) : (
        <RootStack.Screen name="Auth" component={Auth} />
      )}
    </RootStack.Navigator>
  )
}

export default Routes
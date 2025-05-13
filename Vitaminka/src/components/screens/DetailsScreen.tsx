import { Text, View } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

type TabParamList = {
  Feed: undefined
  Profile: undefined
}

const Tab = createBottomTabNavigator<TabParamList>()

const FeedScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Это лента новостей</Text>
    </View>
  )
}
const ProfileScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Это профиль пользователя</Text>
    </View>
  )
}

export const DetailsScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}
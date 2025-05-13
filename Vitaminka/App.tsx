import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { DetailsScreen } from "./src/components/screens/DetailsScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Text, View } from "react-native";
import { ClientScreen } from "./src/components/screens/ClientScreen";
import { ProductScreen } from "./src/components/screens/ProductScreen";

type RootStackParamList = {
  Home: undefined
  Details: {
    itemId: number
    otherParam: string
  }
}

type DrawerParamList = {
  "Продукты": undefined
  "Клиенты": undefined
  "Установки": undefined
}

const Drawer = createDrawerNavigator<DrawerParamList>()

const SettingsScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Это экран настроек</Text>
    </View>
  )
}


const Stack = createStackNavigator<RootStackParamList>()

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator screenOptions={{
        // drawerActiveBackgroundColor: 'red',
        // overlayColor: 'blue',
        headerTintColor: 'green',
        headerPressColor: 'yellow',
        swipeEdgeWidth: 150,
        drawerContentContainerStyle: {
          width: 200,


        },
        drawerStyle: {
          width: 200,

        }
      }}>
        <Drawer.Screen name="Продукты" component={ProductScreen} />
        <Drawer.Screen name="Клиенты" component={ClientScreen} />
        <Drawer.Screen name="Установки" component={SettingsScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
import React from 'react'
import { Image, StatusBar, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native'
import { THEME } from '../Default'
import { ClientScreen } from './screens/ClientScreen'
import { OrderScreen } from './screens/OrderScreen'
import { PaymentScreen } from './screens/PaymentScreen'
import { MaterialIcons } from '@expo/vector-icons'
import { StatusScreen } from './screens/StatusScreen'

interface NavBarProps {
  component: (component: React.ReactNode) => void
}

interface navBarItemProps {
  component: React.ReactNode,
  imageSource: any,
  text: string
}

const NavBarItems: navBarItemProps[] = [
  { component: <ClientScreen />, imageSource: require('../../assets/WomanWhite.png'), text: 'Клиенты' },
  { component: <OrderScreen />, imageSource: require('../../assets/Documents.png'), text: 'Документы' },
  { component: <PaymentScreen />, imageSource: require('../../assets/Payments.png'), text: 'Оплаты' },
  { component: <StatusScreen />, imageSource: require('../../assets/Status.png'), text: 'статус' },
]

export const NavBar = ({ component }: NavBarProps) => {
  return (
    <View style={style.container}>
      <StatusBar hidden />
      {NavBarItems && NavBarItems.map((item, index) => (
        <TouchableNativeFeedback
          key={index}
          onPress={() => component(item.component)}
          background={TouchableNativeFeedback.Ripple(THEME.color.white, false)}
        >
          <View style={style.button}>
            <Image style={style.image} source={item.imageSource} />
            <Text style={{ color: THEME.color.white, fontWeight: 700, textTransform: 'uppercase', fontSize: 10 }}>
              {item.text}
            </Text>
          </View>
        </TouchableNativeFeedback>
      )
      )}
    </View>
  )
}


const style = StyleSheet.create({
  container: {
    // flex: 1,
    // padding: 5,
    // height: 50,
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    // height: 70,
    backgroundColor: THEME.color.main
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: 'contain'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    gap: 5
  }

})
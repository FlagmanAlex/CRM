import React from 'react'
import { Alert, Image, StatusBar, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native'
import { THEME } from '../Default'
import { ClientScreen } from './screens/ClientScreen/ClientScreen'
import { OrderScreen } from './screens/OrderScreen/OrderScreen'

interface NavBarProps {
  component: (component: React.ReactNode) => void
}

export const NavBar = ({ component }: NavBarProps) => {

  return (
    <View style={style.container}>
      <StatusBar hidden />

      <TouchableNativeFeedback
        onPress={() => component(<ClientScreen />)}
        background={TouchableNativeFeedback.Ripple(THEME.color.white, false)}        
      >
        <View style={style.button}>
          <Image style={style.image} source={require('../../assets/WomanWhite.png')} />
          <Text style={{ color: THEME.color.white, fontWeight: 700, textTransform: 'uppercase', fontSize: 10 }}>
            Клиенты
          </Text>
        </View>
      </TouchableNativeFeedback>

      <TouchableNativeFeedback
        onPress={() => component(<OrderScreen />)}
        background={TouchableNativeFeedback.Ripple(THEME.color.white, false)}        
      >
        <View style={style.button}>
          <Image style={style.image} source={require('../../assets/Documents.png')} />
          <Text style={{ color: THEME.color.white, fontWeight: 700, textTransform: 'uppercase', fontSize: 10 }}>
            Документы
          </Text>
        </View>
      </TouchableNativeFeedback>

    </View>
  )
}


const style = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 10,
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
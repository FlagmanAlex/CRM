import React from 'react'
import { Alert, Image, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native'
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

      <TouchableOpacity 
        onPress={() => component(<ClientScreen />)}
      >
          <Image style={style.image} source={require('../../assets/WomanWhite.png')} />
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => component(<OrderScreen />)}
      >
          <Image style={style.image} source={require('../../assets/Documents.png')} />
      </TouchableOpacity>

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
      width: 50,
      height: 50,
      resizeMode: 'contain'
    }

})
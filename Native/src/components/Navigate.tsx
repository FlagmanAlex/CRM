import React, { useState } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { NavBar } from './NavBar'

export const Navigate = () => {

  const [component, setComponent] = useState<React.ReactNode>(null)

  const handlerComponent = (component: React.ReactNode) => {
    setComponent(component)
  }

  return (
    <View style={style.fullHeight}>
      <NavBar component={handlerComponent} />
      {component}
    </View>
  )
}


const style = StyleSheet.create({
  fullHeight: {
    flex: 1,
    height: Dimensions.get('window').height
  }
})
import { View, Text, Button } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'

// Определяем типы для параметров маршрутов
type RootStackParamList = {
  Home: undefined; // Нет параметров для Home
  Details: { itemId: number; otherParam: string }; // Параметры для Details
};

export const HomeScreen = ({ navigation }: {navigation: any}) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Добро пожаловать на главный экран</Text>
      <Button 
        title='Перейти к деталям'
        onPress={() => 
          navigation.navigate('Details', { itemId: 86, otherParam: 'some text' })
        }
      />
    </View>
  )
}
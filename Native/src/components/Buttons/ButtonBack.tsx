import React from 'react'
import { StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native'
import { THEME } from '../../Default'
import { AntDesign } from '@expo/vector-icons'

interface ButtonProps {
    onPress: () => void
}

export const ButtonBack = ({ onPress } : ButtonProps) => {
  return (
    <TouchableNativeFeedback onPress={onPress}>
        <View style={style.button}>
            <Text style={style.text}><AntDesign name='back' size={30}/></Text>
        </View>
    </TouchableNativeFeedback>
  )
}

const style = StyleSheet.create({
    button: {
        // flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
        justifyContent: 'center',
        borderRadius: 30,
        backgroundColor: THEME.button.cancel,
        
    },
    text: {
        color: THEME.color.white

    }
})
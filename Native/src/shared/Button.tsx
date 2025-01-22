import React from 'react'
import { StyleSheet, Text, TouchableHighlight, TouchableNativeFeedback, TouchableNativeFeedbackComponent, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { THEME } from '../Default'

interface ButtonProps {
    children: React.ReactNode
    onPress: () => void
    textColor?: string
    bgColor?: string
}

export const Button = ({ children, textColor = THEME.color.black, bgColor = THEME.color.main, onPress }: ButtonProps) => {
  return (
    <TouchableNativeFeedback onPress={onPress}>
        <View style={{...style.button, backgroundColor: bgColor }}>
            <Text style={{...style.text, color: textColor }}>{children}</Text>
        </View>
    </TouchableNativeFeedback>
  )
}

const style = StyleSheet.create({
    button: {
        // flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
        justifyContent: 'center',
        borderRadius: 10,
        
    },
    text: {
        textTransform: 'uppercase',
        fontWeight: 800
    }
})

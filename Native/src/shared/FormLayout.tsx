import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { THEME } from '../Default'

interface FormProps {
    headerText: string 
    onClose: () => void
    children: React.ReactNode
}

export const FormLayout = ({ headerText, onClose, children }: FormProps) => {
    return (
        <View style={style.content}>
            <View style={style.titleBlock}>
                <Text style={style.headerText}>{headerText}</Text>
                <TouchableOpacity onPress={onClose}>
                    <Image style={style.image} source={require('../../assets/Close.png')} />
                </TouchableOpacity>
            </View>
                {children}
        </View>
    )
}

const style = StyleSheet.create({
    content: {
        width: '100%',
        height: '100%',
        paddingBottom: 50
    },
    titleBlock: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        backgroundColor: THEME.color.main
    },
    headerText: {
        color: THEME.color.white,
        fontSize: 20
    },
    image: {
        width: 30,
        height: 30,
    },
})  
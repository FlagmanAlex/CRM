import React from 'react'
import { Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { THEME } from '../Default'

interface TextFieldProps {
    onChangeText: (text: string) => void | undefined
    value?: string | undefined
    placeholder: string
}

export const TextField = ({ onChangeText, value, placeholder } : TextFieldProps ) => {

    return (
        <View style={style.searchPanel}>
            <View style={style.panelInput} >
                <TextInput
                    style={style.textInput}
                    onChangeText={text => onChangeText(text)}
                    placeholder={placeholder}
                    value={value}
                />
                <TouchableOpacity onPress={() => onChangeText('')}>
                    <Image style={{ width: 30, height: 30 }} source={require('../../assets/Close.png')} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    searchPanel: {
        // backgroundColor: THEME.color.main,
        padding: 10,
        flexDirection: 'row'
      },
      panelInput: {
        paddingHorizontal: 5,
        width: '100%',
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    
      },
      textInput: {
        borderColor: THEME.color.grey,
        // borderStyle: 'solid',
        fontSize: 20,
      },
    
})
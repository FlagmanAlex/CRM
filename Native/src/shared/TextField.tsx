import React from 'react'
import { Image, KeyboardType, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { THEME } from '../Default'
import { FontAwesome } from "@expo/vector-icons";

interface TextFieldProps {
    onChangeText: (text: string) => void | undefined
    value?: string | number | Date| undefined
    placeholder: string
    keyboardType?: KeyboardType
    multiline?: boolean
}

export const TextField = ({ onChangeText, value, placeholder, keyboardType = 'default' } : TextFieldProps ) => {

    return (
        <View style={style.searchPanel}>
            <View style={style.panelInput} >
                <TextInput
                    style={style.textInput}
                    onChangeText={text => onChangeText(text)}
                    placeholder={placeholder}
                    value={value?.toString()}
                    keyboardType={keyboardType}
                    autoCapitalize={keyboardType === 'url' ? 'none' : 'characters'}
                    multiline={true}
                />
                <TouchableOpacity onPress={() => onChangeText('')}>
                    {
                        value ? (
                            <View style={{ padding: 5 }}>
                                <FontAwesome name='close' size={30}/>
                            </View>
                        ) : ( null )
                    }
                </TouchableOpacity>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    searchPanel: {
        // backgroundColor: THEME.color.main,
        padding: 5,
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
        width: '90%'
      },
    
})
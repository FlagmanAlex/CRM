import React, { useEffect, useRef, useState } from 'react'
import { Animated, KeyboardType, LogBox, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SETTINGS, THEME } from '../Default'
import DatePick from 'react-native-modal-datetime-picker'
import { Ionicons, FontAwesome } from "@expo/vector-icons";

interface TextFieldProps {
    onChangeText: (text: string) => void | undefined
    value?: string | number | Date | undefined
    placeholder: string
    keyboardType?: KeyboardType
    multiline?: boolean
}

export const TextField = ({ onChangeText, value, placeholder, keyboardType = 'default' }: TextFieldProps) => {

    const [isFocused, setIsFocused] = useState<boolean>(false)
    const [deliveryDate, setDeliveryDate] = useState<Date>(new Date())
    const [showDate, setShowDate] = useState<boolean>(false)

    const animatedValue = useRef(new Animated.Value(isFocused ? 1 : 0)).current
    
    useEffect(() => {
        if (value instanceof Date) setDeliveryDate(value)
        startAnimation(!!value || isFocused)
    }, [value, isFocused])


    const startAnimation = (focused: boolean) => {
        Animated.timing(animatedValue, {
            toValue: focused ? 1 : 0,
            duration: 200,
            useNativeDriver: false
        }).start()
    }


    return (
        <View style={styles.searchPanel}>
            {value instanceof Date ? (
                <>
                    <TouchableOpacity onPress={() => setShowDate(true)}>
                        <View style={styles.dateContainer}>
                            <FontAwesome name='calendar' size={20} />
                            <Text style={styles.dateText}>{deliveryDate ? deliveryDate.toLocaleDateString() : ''}</Text>
                        </View>
                    </TouchableOpacity>
                    <DatePick
                        display='calendar'
                        date={deliveryDate}
                        mode='date'
                        isVisible={showDate}
                        onConfirm={(newDate) => {
                            setShowDate(false)
                            setDeliveryDate(newDate)
                            onChangeText(newDate.toISOString())
                        }}
                        onCancel={() => setShowDate(false)}
                    />
                </>
            ) 
            : 
            (
                <>
                    <Animated.View
                        style={{
                            ...styles.floatingLabel,
                            transform: [
                                {
                                    translateY: animatedValue.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [5, -20]
                                    })
                                },
                                {
                                    scale: animatedValue.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [1, 0.6]
                                    })
                                }
                            ],
                            opacity: animatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 1]
                            })
                        }}
                        pointerEvents='none'
                    >
                        <Text style={styles.labelText}>{placeholder}</Text>
                    </Animated.View>

                    <View style={styles.panelInput} >
                        <TextInput
                            style={styles.textInput}
                            onChangeText={text => onChangeText(text)}
                            placeholder={isFocused || (
                                value !== undefined &&
                                value.toString() !== '0' &&
                                !!value?.toString().trim().length
                            ) ? '' : placeholder}
                            value={value !== null && value !== undefined && value !== 0 ? value?.toString() : ''}
                            keyboardType={keyboardType}
                            autoCapitalize={keyboardType === 'url' ? 'none' : 'words'}
                            multiline={true}
                            onFocus={() => {
                                setIsFocused(true)
                                startAnimation(true)
                            }}
                            onBlur={() => {
                                if (!value) {
                                    setIsFocused(false)
                                    startAnimation(false)
                                }
                            }}
                        />
                            {
                                value ? (
                                    <View style={{ padding: 5 }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                onChangeText('')
                                                setIsFocused(false)
                                                startAnimation(false)
                                            }}
                                        >
                                            <Ionicons name='close' size={30} />
                                        </TouchableOpacity>
                                    </View>
                                ) : (null)
                            }
                    </View>
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    searchPanel: {
        width: '100%',
        // backgroundColor: THEME.color.main,
        paddingHorizontal: 5,
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
        borderStyle: 'solid',
        fontSize: 20,
        width: '90%',
    },
    floatingLabel: {
        position: 'absolute',
        left: 10,
        top: 10,
        zIndex: 10,
        backgroundColor: THEME.color.white,
        paddingHorizontal: 5,
        paddingTop: 2,
        paddingBottom: 4,
        borderRadius: 5,
    },
    labelText: {
        fontSize: 20,
        color: THEME.color.black
    },
    dateText: {
        // margin: 20,
        fontSize: 20,
    },
    dateIcon: {
        padding: 50,
        margin: 50
    },
    dateContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
        // padding: 10,
    }

})
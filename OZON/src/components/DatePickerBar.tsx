import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import DateP from 'react-native-modal-datetime-picker'
import React, { useState } from 'react'
import { DatePicker } from '../shared/DatePicker'
import { THEME } from '../Default'

interface DatePickerProps {
    startDate: string
    setStartDate: (date: string) => void
    endDate: string
    setEndDate: (date: string) => void
}

export const DatePickerBar = ({ startDate, setStartDate, endDate, setEndDate }: DatePickerProps) => {

    const [show, setShow] = useState(false)

    return (
        <>
            <View style={styles.dateBlock}>
                <Text style={styles.text}>c: </Text>
                <DatePicker style={{ color: THEME.color.white }} date={new Date(startDate)} setDate={setStartDate} />
                <Text style={styles.text}> по: </Text>
                <DatePicker style={{ color: THEME.color.white }} date={new Date(endDate)} setDate={setEndDate} />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    dateBlock: {
        backgroundColor: THEME.color.main,
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        // elevation: 1
    },
    //-----------------------------------------
    text: {
        color: THEME.color.white,
        fontSize: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textDate: {
        textDecorationLine: 'underline'
    },
})
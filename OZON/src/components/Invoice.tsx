import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { IOrderItem } from '../../../Interfaces/IOrderItem'

type InvoiceProps = {
    orderItems: IOrderItem[]
}

const itemCard = (orderItem: IOrderItem) => (
    <View style={styles.cardContent}>
        <Text style={styles.text}>{orderItem.item}</Text>
        <Text style={styles.text}>{new Date(orderItem.dateTo).toLocaleDateString()}</Text>
        <Text style={styles.text}>{orderItem.quantity}</Text>
        <Text style={styles.text}>x</Text>
        <Text style={styles.text}>{orderItem.price}</Text>
        <Text style={styles.text}>=</Text>
        <Text style={styles.text}>{orderItem.price}</Text>
    </View>
)

export const Invoice = ({ orderItems }: InvoiceProps) => {
    return orderItems.map((orderItem, index) => (
        <View key={index} style={styles.content}>
            {itemCard(orderItem)}
        </View>
    ))
}

const styles = StyleSheet.create({
    content: {
        height: 20
    },
    cardContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    text: {
        flex: 1,
        textAlign: 'right'
    }
})
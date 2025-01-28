import React, { useContext, useEffect, useState } from 'react'
import { Alert, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SETTINGS, THEME } from '../../Default'
import { IOrderList } from '../../../../Interfaces/IOrderList'
import axios from 'axios'
import { OrderItemCard } from '../OrderItemCard'
import { FormLayout } from '../../shared/FormLayout'
import { FontAwesome } from '@expo/vector-icons'
import { useContextData } from '../../ContextProvider'

interface OrderFormProps {
    order: IOrderList | undefined
    onClose: () => void

}

const server = `${SETTINGS.host}:${SETTINGS.port}`

export const OrderForm = ({ onClose, order }: OrderFormProps) => {

    const { orderItems, setOrderItems } = useContextData()

    const handleNewOrder = () => {

    }
    const handleSaveOrder = () => {
        
    }
    const handleUpdateOrder = () => {
        
    }
    const handleDeleteOrder = () => {
        
    }

    useEffect(() => {
        const responseDB = async () => {
            try {
                const response = await axios.get(`${server}/api/order/items/${order?._id}`)
                setOrderItems(response.data)
            } catch (error) {
                Alert.alert('Ошибка сервера')
            }
        }

        responseDB()

    }, [orderItems])


    return order ?
        <FormLayout headerText={`Заказ ${order.orderNum} - orderFormModal`} onClose={onClose} >
            <View style={style.orderBlock}>
                <View style={style.headerBlock}>
                    <View style={style.lineBlock}>
                        <Text style={style.text}>{`Дата ${new Date(order.date).toLocaleDateString()}`}</Text>
                    </View>
                    <View style={style.lineBlock}>
                        <Text style={style.text}>{`№ заказа: ${order.orderNum}`}</Text>
                        <Text style={style.text}>{`Доставка: ${order.percent}%`}</Text>
                    </View>
                    <View>
                        <Text
                            style={[style.text, { fontWeight: 700 }]}
                            numberOfLines={1}
                        >
                            {`Клиент: ${order.clientName}`}
                        </Text>
                    </View>
                </View>
                <FlatList
                    data={orderItems}
                    renderItem={({ item }) =>
                        <View style={style.card}>
                            <OrderItemCard
                                key={item._id}
                                percent={order.percent}
                                // order={order}
                                orderItem={item}
                            />
                        </View>
                    }
                    ListFooterComponent={
                        <TouchableOpacity>
                            <View style={style.newCard}>
                                <FontAwesome
                                    name='plus'
                                    size={80}
                                    color={THEME.color.grey}
                                />
                            </View>
                        </TouchableOpacity>
                    }
                    keyExtractor={(item, index) => item._id ?? index.toString()}
                />
            </View>
        </FormLayout>
        : null
}

const style = StyleSheet.create({
    orderBlock: {
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingVertical: 10,
        padding: 5,
    },
    headerBlock: {
        padding: 10,
        elevation: 1
    },
    lineBlock: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 5
    },
    text: {
        fontSize: 20,
    },
    card: {
        paddingBottom: 5,
    },
    newCard: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        width: '100%',
        // height: 50,
        borderStyle: 'solid',
        borderRadius: 1,
        elevation: 1,
        padding: 10,
    },
})
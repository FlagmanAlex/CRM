import React, { useContext, useEffect, useState } from 'react'
import { Alert, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SETTINGS, THEME } from '../../../../../Default'
import { IOrderList } from '../../../../../../../Interfaces/IOrderList'
import axios from 'axios'
import { OrderItemCard } from './OrderItemCard/OrderItemCard'
import { FormLayout } from '../../../../../shared/FormLayout'
import { FontAwesome } from '@expo/vector-icons'
import { useContextData } from '../../../../../ContextProvider'
import { OrderItemForm } from './OrderItemCard/OrderItemForm/OrderItemForm'
import { IOrderItem } from '../../../../../../../Interfaces/IOrderItem'
import { BottomBar } from '../../../../BottomBar'

interface OrderFormProps {
    order: IOrderList
    onClose: () => void
}


const server = `${SETTINGS.host}:${SETTINGS.port}`

export const OrderForm = ({ onClose, order }: OrderFormProps) => {
    
    const newOrderItem: IOrderItem = {
        dateTo: new Date(),
        deliveryPost: 0,
        discountPrice: 0,
        item: '',
        orderId: order._id,
        payment: 0,
        price: 0,
        pvzId: '6745c7ddc775afaf7466bbd3',
        quantity: 0,
        ord: false, 
        pai: false,
        rec: false,
        ship: false,
    }

    const [openModal, setOpenModal] = useState<boolean>(false)
    const { orderItems, setOrderItems } = useContextData()

    const handleCloseOpenModal = () => {
        setOpenModal(false)
    }

    const handleNewOrderItem = async () => {
        try {
            const response = await axios.post(`${server}/api/order/items/`)
            setOrderItems({...response.data, orderId: order?._id})
        } catch (error) {
            Alert.alert(`Create status: ${error}`)
        }
    }

    const handleDeleteOrderItem = async (id: string) => {
        try {
            await axios.delete(`${server}/api/order/items/${id}`)
            console.log(id);
            
        } catch (error) {
            Alert.alert(`OrderItem status: ${error}`)
        }
    }

    useEffect(() => {
        const responseDB = async () => {
            try {
                if (order) {
                    if (order._id) {
                        const response = await axios.get(`${server}/api/order/items/${order._id}`)
                        setOrderItems(response.data)
                    }
                }
            } catch (error) {
                Alert.alert(`Ошибка сервера ${error}`)
            }
        }

        responseDB()

    }, [orderItems, order])


    return order ?
        <FormLayout headerText={`Заказ ${order.orderNum} - orderForm`} onClose={onClose} >
            {/* <View style={style.orderBlock}> */}
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
                                orderItem={item}
                                deleteItem={handleDeleteOrderItem}
                            />
                        </View>
                    }
                    ListFooterComponent={
                        <TouchableOpacity 
                            onPress={() => setOpenModal(true)}
                        >
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
                    contentContainerStyle={{ flexGrow: 1, padding: 5 }}
                />
            {/* </View> */}
            <Modal visible={openModal}>
                    <OrderItemForm 
                        orderItem={newOrderItem}
                        onClose={handleCloseOpenModal}
                        deleteItem={handleDeleteOrderItem}
                    />
            </Modal>
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
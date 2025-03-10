import React, { useEffect, useLayoutEffect, useState } from 'react'
import { IOrderList } from '../../../../../../Interfaces/IOrderList'
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { OrderForm } from './OrderForm/OrderForm'
import { deleteOrderList, fetchOrderLists, selectOrderListById } from '../../../../store/orderListSlice'
import { useDispatch } from '../../../../store/customHooks'

interface IOrderCardProps {
    orderList: IOrderList
}


export const OrderCard = ({ orderList }: IOrderCardProps) => {

    const dispatch = useDispatch()

    const deliverySumm = Math.round(orderList.priceSum * orderList.percent / 100)
    const paySum = Math.round(orderList.priceSum * (orderList.percent / 100 + 1))

    const [openModal, setOpenModal] = useState(false)
    // console.log(`${orderList._id} - ${orderList.orderNum}`);
    
    const handleClose = () => {
        setOpenModal(false)
    }

    const handleDeleteOrder = async (orderId: string) => {
        Alert.alert('Удаление заказа!!!', `Вы действительно хотите уделить этот заказ?`, [
            {
                text: 'Удалить', style: 'destructive', onPress: async () => {
                    const resp = await (await dispatch(deleteOrderList(orderId))).payload
                    if (resp !== orderId) Alert.alert('Предупреждение!!!', resp ? resp.toString() : '')
                }
            },
            { text: 'Отмена', style: 'cancel' },
        ])

    }
    
    return (
        <>
            <TouchableOpacity 
                onPress={() => setOpenModal(true)}
                onLongPress={() => handleDeleteOrder(orderList._id)}
            >
                <View style={style.content}>
                    <View style={style.titleBlock}>
                        <Text style={{ ...style.text, width: '10%' }}>{orderList.orderNum}</Text>
                        <Text style={{ ...style.text, width: '25%' }}>{new Date(orderList.date).toLocaleDateString()}</Text>
                        <Text
                            style={[style.text, { fontWeight: 600, width: '50%', }]}
                            numberOfLines={1}
                        >
                            {orderList.clientName}
                        </Text>
                        <Text style={style.text}>{`${orderList.percent}%`}</Text>
                    </View>
                    <View style={style.calculationBlock}>
                        <Text >{`Заказ: ${orderList.priceSum}`}</Text>
                        <Text >{`Доставка: ${deliverySumm}`}</Text>
                        <Text >{`К оплате: ${paySum}`}</Text>

                    </View>
                </View>
            </TouchableOpacity>
            {orderList ?
                <Modal visible={openModal}>
                    <OrderForm
                        orderList={orderList}
                        onClose={handleClose}
                    />
                </Modal>
                : null}
        </>
    )
}


const style = StyleSheet.create({
    content: {
        // flex: 1,
        width: '100%',
        borderStyle: 'solid',
        elevation: 1,
        borderRadius: 2,
        padding: 10,
        marginBottom: 5
    },
    titleBlock: {
        flexDirection: 'row',
        // gap: 20,
        justifyContent: 'space-between',
        flexShrink: 1
    },
    calculationBlock: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-around'
    },
    text: {
        fontSize: 18,
    }
})
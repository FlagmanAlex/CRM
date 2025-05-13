import React, { useEffect, useState } from 'react'
import { IOrderList } from '../../../../../Interfaces/IOrderList'
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { OrderForm } from './OrderForm'
import { deleteOrderList } from '../../../store/orderListSlice'
import { useDispatch } from '../../../hooks/useStore'
import { useSelector } from 'react-redux'
import { IPayment } from '../../../../../Interfaces/IPayment'
import { useTotalOrder } from '../../../hooks/useTotalOrder'
import { selectAllPayments } from '../../../store/paymentSlice'

interface IOrderCardProps {
    orderList: IOrderList
}


export const OrderCard = ({ orderList }: IOrderCardProps) => {

    const dispatch = useDispatch()

    const payments: IPayment[] = useSelector(selectAllPayments)
        .filter((payment) => payment.clientId === orderList.clientId)
        .filter(payment => payment.orderId === orderList._id)

    // console.log('OrderCard - payments', payments);


    const [openModal, setOpenModal] = useState(false)

    const { OrderDeliverySum } = useTotalOrder([orderList])

    // const deliverySumm = OrderDeliverySum()
    const paySum = orderList.priceSum + OrderDeliverySum()
    const paymentSum = payments.reduce((total, payment) => { return total + payment.sum }, 0)
    const balance = paySum - paymentSum

    const cardColor = () => {
        if (balance > 0 && balance === paySum) return '#ffcccc'
        else if (balance > 0 && balance < paySum) return '#fffccc'
        else if (balance === 0) return '#ccffcc'
        else return '#ccccff'
    }

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
                <View style={[style.content, { backgroundColor: cardColor() }]}>
                    <View style={style.titleBlock}>
                        <Text style={{ ...style.text, flex: 1 }}>{orderList.orderNum}</Text>
                        <Text style={{ ...style.text, flex: 2 }}>{new Date(orderList.date).toLocaleDateString()}</Text>
                        <Text
                            style={[style.text, { fontWeight: 'bold', flex: 4 }]}
                            numberOfLines={1}
                        >
                            {orderList.clientName}
                        </Text>
                        <Text style={{ ...style.text, flex: 1 }}>{`${orderList.percent}%`}</Text>
                    </View>
                    <View style={style.calculationBlock}>
                        <Text >{`Зак: ${orderList.priceSum.toFixed(0)}`}</Text>
                        <Text >{`Дос: ${OrderDeliverySum().toFixed(0)}`}</Text>
                        <Text >{`КОпл: ${paySum.toFixed(0)}`}</Text>
                        <Text >{`Опл: ${paymentSum.toFixed(0)}`}</Text>

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
        justifyContent: 'space-around',
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


import React, { useState } from 'react'
import { IOrderList } from '../../../../../../Interfaces/IOrderList'
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { OrderForm } from './OrderForm/OrderForm'

interface IOrderCardProps {
    order: IOrderList
}


export const OrderCard = ({ order }: IOrderCardProps) => {

    const deliverySumm = Math.round(order.priceSum * order.percent / 100)
    const paySum = Math.round(order.priceSum * (order.percent / 100 + 1))

    const [openModal, setOpenModal] = useState(false)

    const handleClose = () => {
        setOpenModal(false)
    }

    return (
        <>
            <TouchableOpacity onPress={() => setOpenModal(true)}>
                <View style={style.content}>
                    <View style={style.titleBlock}>
                        <Text style={{ ...style.text, width: '10%' }}>{order.orderNum}</Text>
                        <Text style={{ ...style.text, width: '25%' }}>{new Date(order.date).toLocaleDateString()}</Text>
                        <Text
                            style={[style.text, { fontWeight: 600, width: '50%', }]}
                            numberOfLines={1}
                        >
                            {order.clientName}
                        </Text>
                        <Text style={style.text}>{`${order.percent}%`}</Text>
                    </View>
                    <View style={style.calculationBlock}>
                        <Text >{`Заказ: ${order.priceSum}`}</Text>
                        <Text >{`Доставка: ${deliverySumm}`}</Text>
                        <Text >{`К оплате: ${paySum}`}</Text>

                    </View>
                </View>
            </TouchableOpacity>
            {order ?
                <Modal visible={openModal}>
                    <OrderForm
                        order={order}
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
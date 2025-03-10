import React, { useState } from 'react'
import { IOrderItem } from '../../../../../../../../Interfaces/IOrderItem'
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { THEME } from '../../../../../../Default'
import { OrderItemForm } from './OrderItemForm/OrderItemForm'

interface IOrderItemCardProps {
    orderItem: IOrderItem
    percent: number
}


export const OrderItemCard = ({ orderItem, percent }: IOrderItemCardProps) => {

    const orderSum = Math.round((orderItem.quantity * orderItem.price) * percent / 100)
    const [openModal, setOpenModal] = useState(false)

    const handleClose = () => {
        setOpenModal(false)
    }


    return (
        <>
            <TouchableOpacity onPress={() => setOpenModal(true)} >
                <View style={style.content}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 20, width: '80%' }}>{orderItem.item}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <Text style={{ fontSize: 18 }}>{`Кол-во: ${orderItem.quantity}`}</Text>
                        <Text style={{ fontSize: 18 }}>{`Доставка до ${new Date(orderItem.dateTo).toLocaleDateString()}`}</Text>
                    </View>
                    <View style={style.inline}>
                        <Text style={{ color: THEME.color.wb }}>{`WB:${orderItem.discountPrice}`}</Text>
                        <Text>{`GR:${orderItem.price}`}</Text>
                        {orderItem.deliveryPost ? <Text>{`Доп:${orderItem.deliveryPost}`}</Text> : ''}
                        <Text>{`Дост.:${orderSum}`}</Text>
                        <Text>{`Опл.:${orderItem.payment}`}</Text>
                    </View>
                    <View style={style.inline}>
                        <Text>{`${orderItem.ord}`}</Text>
                        <Text>{`${orderItem.rec}`}</Text>
                        <Text>{`${orderItem.pai}`}</Text>
                        <Text>{`${orderItem.ship}`}</Text>
                    </View>
                </View>
            </TouchableOpacity>
            {orderItem ? (
                <Modal visible={openModal}>
                    <OrderItemForm
                        orderItem={orderItem}
                        onClose={handleClose} 
                    />
                </Modal>
            ) : null
            }
        </>
    )
}


const style = StyleSheet.create({
    content: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        // height: 50,
        borderStyle: 'solid',
        borderRadius: 1,
        elevation: 1,
        padding: 10,
    },
    inline: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    }

})
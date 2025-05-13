import React, { useState } from 'react'
import { IOrderItem } from '../../../../../Interfaces/IOrderItem'
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { OrderItemForm } from './OrderItemForm'
import { ButtonStatus } from '../../../shared/Buttons/ButtonStatus'
import { useDispatch } from '../../../hooks/useStore'
import { updateOrderItem } from '../../../store/orderItemSlice'

interface IOrderItemCardProps {
    orderItem: IOrderItem
    // percent: number
}


export const OrderItemCard = ({ orderItem }: IOrderItemCardProps) => {

    const dispatch = useDispatch()

    // const orderSum = Math.round((orderItem.quantity * orderItem.price) * percent / 100)
    const [openModal, setOpenModal] = useState(false)

    const handleOrd = () => {
        const updOrderItem: IOrderItem = {
            ...orderItem,
            ord: !orderItem.ord
        }
        dispatch(updateOrderItem(updOrderItem))
    }
    const handleRec = () => {
        const updOrderItem: IOrderItem = {
            ...orderItem,
            rec: !orderItem.rec
        }
        dispatch(updateOrderItem(updOrderItem))

    }
    const handlePai = () => {
        const updOrderItem: IOrderItem = {
            ...orderItem,
            pai: !orderItem.pai
        }
        dispatch(updateOrderItem(updOrderItem))

    }
    const handleShip = () => {
        const updOrderItem: IOrderItem = {
            ...orderItem,
            ship: !orderItem.ship
        }
        dispatch(updateOrderItem(updOrderItem))

    }

    const handleClose = () => {
        setOpenModal(false)
    }


    return (
        <>
            <TouchableOpacity onPress={() => setOpenModal(true)} >
                <View style={style.content}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 20, flex: 1 }}>{orderItem.item}</Text>
                    </View>
                    <View style={style.inline}>
                        <Text style={{}}>{`Кол-во: ${orderItem.quantity}`}</Text>
                        {/* <Text style={{ color: THEME.color.wb }}>{`Цена1:${orderItem.discountPrice}`}</Text> */}
                        <Text>{`Цена:${orderItem.price}`}</Text>
                        {orderItem.deliveryPost ? <Text>{`Доп:${orderItem.deliveryPost}`}</Text> : ''}
                        {/* <Text>{`Дост.:${orderSum}`}</Text> */}
                        <Text>{`Сумм:${orderItem.price * orderItem.quantity}`}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <Text style={{ fontSize: 18 }}>{`Доставка до ${new Date(orderItem.dateTo).toLocaleDateString()}`}</Text>
                    </View>
                    <View style={style.inline}>
                        <ButtonStatus name='зак' onPress={handleOrd} enabled={orderItem.ord} />
                        {/* <ButtonStatus name='опл' onPress={handlePai} enabled={orderItem.pai} /> */}
                        <ButtonStatus name='пол' onPress={handleRec} enabled={orderItem.rec} />
                        <ButtonStatus name='отг' onPress={handleShip} enabled={orderItem.ship} />
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
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Alert, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View, } from 'react-native'
import { getAdditionalSum, getDeliveryItemsSumTotal, getOrderItemsSumTotal, host, port, THEME } from '../../../../../Default'
import { IOrderList } from '../../../../../../../Interfaces/IOrderList'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { IOrderItem } from '../../../../../../../Interfaces/IOrderItem'
import { IOrder } from '../../../../../../../Interfaces/IOrder'
import { IClient } from '../../../../../../../Interfaces/IClient'
import { useDispatch } from '../../../../../store/customHooks'
// import { updateOrder } from '../../../../../store/orderSlice'
import { updateOrderAndOrderList } from '../../../../../store/orderListSlice'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../../store'
import { FormLayout } from '../../../../../shared/FormLayout'
import DatePicker from 'react-native-modal-datetime-picker'
import { OrderItemCard } from './OrderItemCard/OrderItemCard'
import { OrderItemForm } from './OrderItemCard/OrderItemForm/OrderItemForm'
import { ClientScreen } from '../../../ClientScreen/ClientScreen'
import { TotalBar } from '../../../../TotalBar'
import { BottomBar } from '../../../../BottomBar'
import { fetchOrderItem, selectAllOrderItem } from '../../../../../store/orderItemSlice'

interface OrderFormProps {
    orderList: IOrderList
    onClose: () => void
}

interface IStatusData {
    key: string, sum: number
}

type IconName = React.ComponentProps<typeof MaterialIcons>["name"]

type BottomData = Array<{ icons: IconName, action: () => void }>

export const OrderForm = ({ onClose, orderList }: OrderFormProps) => {
    const newOrderItem: IOrderItem = {
        dateTo: new Date().toISOString(),
        deliveryPost: 0,
        discountPrice: 0,
        item: '',
        orderId: orderList._id,
        payment: 0,
        price: 0,
        pvzId: '6745c7ddc775afaf7466bbd3',
        quantity: 0,
        ord: false,
        pai: false,
        rec: false,
        ship: false,
    }
    const dispatch = useDispatch()

    const orderItems = useSelector(selectAllOrderItem)

    const [openItemFormModal, setOpenItemFormModal] = useState<boolean>(false)
    const [openClientScreen, setOpenClientScreen] = useState<boolean>(false)
    const [showDate, setShowDate] = useState<boolean>(false)
    const [currentOrderList, setCurrentOrderList] = useState<IOrderList>(orderList)

    const orderSum = orderItems ?
        getOrderItemsSumTotal(orderItems) : 0
    const deliverySum = orderItems && orderList ?
        getDeliveryItemsSumTotal(orderItems, orderList) : 0
    const additionalSum = orderItems ?
        getAdditionalSum(orderItems) : 0

    const paySum = orderSum + deliverySum + additionalSum

    const statusData: IStatusData[] = [
        { key: 'Зак', sum: orderSum || 0 },
        { key: 'Дост', sum: deliverySum },
        { key: 'Доп', sum: additionalSum },
        { key: 'КОпл', sum: paySum },
        { key: 'Опл', sum: 0 },
    ]

    const bottomData: BottomData = [
        { icons: 'save', action: () => handleOrderUpdate() }
    ]

    const handleCloseItemFormModal = () => {
        setOpenItemFormModal(false)
    }

    const handleSelectClient = async (client: IClient) => {
        if (client._id &&
            orderList) {
            const orderListUpdate: IOrderList = {
                ...orderList,
                clientId: client._id,
                clientName: client.name,
            }
            dispatch(updateOrderAndOrderList(orderListUpdate))
            setOpenClientScreen(false)
        }
    }

    const handleOrderUpdate = () => {
        orderUpdate()
        onClose()
    }

    const orderUpdate = async () => {
        if (currentOrderList) {
            const orderListUpdate: IOrderList = {
                ...currentOrderList,
            }
            dispatch(updateOrderAndOrderList(orderListUpdate))
            // setOpenClientScreen(false)
        }
    }

    useEffect(() => {
        const fetchDB = async () => {
            dispatch(fetchOrderItem(orderList._id))
        }
        fetchDB()
    }, [orderList._id, dispatch])

    useEffect(() => {
        orderUpdate()    
    }, [currentOrderList])
    

    return orderList ?
        <FormLayout headerText={`Заказ ${currentOrderList.orderNum} - orderForm`} onClose={onClose} >
            {/* <View style={style.orderBlock}> */}
            <View style={style.headerBlock}>
                <View style={style.lineBlock}>
                    <TouchableOpacity onPress={() => setShowDate(true)}>
                        <Text style={[style.text, { textDecorationLine: 'underline' }]}>
                            {`Дата ${new Date(currentOrderList.date).toLocaleDateString()}`}
                        </Text>
                    </TouchableOpacity>
                    {currentOrderList.date &&
                        currentOrderList &&
                        <DatePicker
                            date={currentOrderList.date ? new Date(currentOrderList.date) : new Date()}
                            isVisible={showDate}
                            onConfirm={(newDate) => {
                                setCurrentOrderList({...currentOrderList, date: newDate.toISOString()})
                                setShowDate(false)
                            }}
                            onCancel={() => setShowDate(false)}
                        />
                    }
                </View>
                <View style={style.lineBlock}>
                    <Text style={style.text}>{`№ заказа: ${orderList.orderNum}`}</Text>
                    <Text style={style.text}>{`Доставка: ${orderList.percent}%`}</Text>
                </View>
                <View>
                    <TouchableOpacity onPress={() => setOpenClientScreen(true)}>
                        <Text style={[style.text, { fontWeight: 700 }]} numberOfLines={1}>
                            {`Клиент: ${orderList.clientName}`}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList
                data={orderItems}
                renderItem={({ item }) =>
                    <View style={style.card}>
                        <OrderItemCard
                            key={item._id}
                            percent={orderList.percent}
                            orderItem={item}
                        />
                    </View>
                }
                ListFooterComponent={
                    <TouchableOpacity
                        onPress={() => setOpenItemFormModal(true)}
                    >
                        <View style={style.newCard}>
                            <FontAwesome
                                name='plus'
                                size={50}
                                color={THEME.color.grey}
                            />
                        </View>
                    </TouchableOpacity>
                }
                keyExtractor={(item, index) => item._id ?? index.toString()}
                contentContainerStyle={{ flexGrow: 1, padding: 5 }}
            />
            {/* </View> */}
            <Modal visible={openItemFormModal}>
                <OrderItemForm
                    orderItem={newOrderItem}
                    onClose={handleCloseItemFormModal}
                />
            </Modal>
            <Modal visible={openClientScreen}>
                <FormLayout onClose={() => setOpenClientScreen(false)} headerText='Выберите клиента'>
                    <ClientScreen select={handleSelectClient} />
                </FormLayout>
            </Modal>
            <TotalBar statusData={statusData} />
            <BottomBar bottomData={bottomData} />
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
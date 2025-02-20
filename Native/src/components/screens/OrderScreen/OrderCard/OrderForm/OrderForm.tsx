import React, { useEffect, useState } from 'react'
import { Alert, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { getAdditionalSum, getDeliveryItemsSumTotal, getOrderItemsSumTotal, SETTINGS, THEME } from '../../../../../Default'
import { IOrderList } from '../../../../../../../Interfaces/IOrderList'
import axios from 'axios'
import { OrderItemCard } from './OrderItemCard/OrderItemCard'
import { FormLayout } from '../../../../../shared/FormLayout'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { useContextData } from '../../../../../ContextProvider'
import { OrderItemForm } from './OrderItemCard/OrderItemForm/OrderItemForm'
import { IOrderItem } from '../../../../../../../Interfaces/IOrderItem'
import { BottomBar } from '../../../../BottomBar'
import { IOrder } from '../../../../../../../Interfaces/IOrder'
import DatePicker from 'react-native-modal-datetime-picker'
import { IClient } from '../../../../../../../Interfaces/IClient'
import { ClientScreen } from '../../../ClientScreen/ClientScreen'
import { TotalBar } from '../../../../TotalBar'

interface OrderFormProps {
    orderList: IOrderList
    onClose: () => void
}

interface IStatusData {
      key: string, sum : number
    }
  

type IconName = React.ComponentProps<typeof MaterialIcons>["name"]

type BottomData = Array<{ icons: IconName, action: () => void }>


const server = `${SETTINGS.host}:${SETTINGS.port}`

export const OrderForm = ({ onClose, orderList }: OrderFormProps) => {
    
    const newOrderItem: IOrderItem = {
        dateTo: new Date(),
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

    const [openItemFormModal, setOpenItemFormModal] = useState<boolean>(false)
    const [openClientScreen, setOpenClientScreen] = useState<boolean>(false)
    const [currentOrder, setCurrentOrder] = useState<IOrder>()
    const [currentOrderList, setCurrentOrderList] = useState<IOrderList>()
    const [showDate, setShowDate] = useState<boolean>(false)
    const { orderLists, setOrderLists } = useContextData()
    const { orderItems, setOrderItems } = useContextData()

    const orderSum = getOrderItemsSumTotal(orderItems)
    const deliverySum = getDeliveryItemsSumTotal(orderItems, orderLists)
    const additionalSum = getAdditionalSum(orderItems)
    const paySum = orderSum + deliverySum + additionalSum

    const statusData: IStatusData[] = [
        { key: 'Зак', sum: orderSum },
        { key: 'Дост', sum: deliverySum },
        { key: 'Доп', sum: additionalSum },
        { key: 'КОпл', sum: paySum },
        { key: 'Опл', sum: 0 },
    ]

    const bottomData: BottomData = [
        { icons: 'save', action: () => handleOrderUpdate()}
    ]

    const handleCloseItemFormModal = () => {
        setOpenItemFormModal(false)
    }

    const handleSelectClient = async (client: IClient) => {
        try {
            if (client._id && currentOrder && currentOrderList) {
                const orderUpdate: IOrder = {
                    ...currentOrder,
                    clientId: client._id,
                    percent: client.percent
                }
                const orderListUpdate: IOrderList = {
                    ...currentOrderList,
                    clientId: client._id,
                    clientName: client.name,
                    percent: client.percent
                }
                
                await axios.put(`${server}/api/order/${currentOrder._id}`, orderUpdate)
                setCurrentOrder(orderUpdate)
                setCurrentOrderList(orderListUpdate)
                console.log(currentOrder);

                const updateOrderLists = orderLists.map((orderList) => {
                    if (orderList._id === currentOrder._id) {
                        return currentOrderList
                    } else return orderList
                })
                setOrderLists(updateOrderLists)
                setOpenClientScreen(false)
            }
        } catch (error) {
            Alert.alert(`Ошибка сервера: ${error}`)
        }
    }

    const handleOrderUpdate = () => {
        orderUpdate()
        onClose()
    }

    const orderUpdate = async () => {
        try {
         // Отправляем данные на сервер
         const response = await axios.put(`${server}/api/order/${currentOrder?._id}`, currentOrder);
        
         // Получаем обновленные данные с сервера
         const updatedOrder: IOrderList = response.data;
 
         // Обновляем локальное состояние orderLists
         const updatedOrderLists = orderLists.map((order) =>
             order._id === updatedOrder._id ? { ...order, ...updatedOrder } : order
         );
 
         // Если это новый заказ (не найден в списке), добавляем его в массив
         if (!orderLists.some((order) => order._id === updatedOrder._id)) {
             updatedOrderLists.push(updatedOrder);
         }
         // Обновляем состояние
         setOrderLists(updatedOrderLists);
         // Закрываем форму

        } catch (error) {
            Alert.alert(`Ошибка сохранения Order: ${error}`)
        }
    }

    const handleDeleteOrderItem = async (id: string) => {
        try {
            await axios.delete(`${server}/api/order/items/${id}`)
            const updateOrderItems = orderItems.filter(item => item._id !== id)
            setOrderItems(updateOrderItems)            
        } catch (error) {
            Alert.alert(`OrderItem status: ${error}`)
        }
    }

    // useEffect(() => {
    // },[])

    useEffect(() => {
        const responseDB = async () => {
            try {
                if (orderList) {
                    if (orderList._id) {

                        const respOrder = await axios.get(`${server}/api/order/${orderList._id}`)
                        const updateOrder: IOrder = {
                            ...respOrder.data,
                            date: respOrder.data.date ? new Date(respOrder.data.date) : undefined
                        }
                        // console.log(respOrder.data);
                        setCurrentOrder(updateOrder)
                        setCurrentOrderList(orderList)
                    }
                }
            } catch (error) {
                Alert.alert(`Ошибка сервера ${error}`)
            }
        }

        responseDB()

    }, [])

    useEffect(() => {
        const responseDB = async () => {
            try {
                if (orderList._id) {
                    const respOrderItem = await axios.get(`${server}/api/order/items/${orderList._id}`)
                    setOrderItems(respOrderItem.data)
                }
            } catch (error) {
                Alert.alert(`Ошибка сервера ${error}`)
            }
        }
        responseDB()

    }, [orderItems])


    return currentOrder ?
        <FormLayout headerText={`Заказ ${currentOrder.orderNum} - orderForm`} onClose={onClose} >
            {/* <View style={style.orderBlock}> */}
                <View style={style.headerBlock}>
                    <View style={style.lineBlock}>
                        <TouchableOpacity onPress={() => setShowDate(true)}>
                            <Text style={[style.text, { textDecorationLine: 'underline' }]}>{`Дата ${currentOrder.date ? currentOrder.date.toLocaleDateString() : '2025-02-13'}`}</Text>
                        </TouchableOpacity>
                        {   currentOrder.date && 
                            currentOrderList &&
                            <DatePicker
                                date={currentOrder.date}
                                isVisible={showDate}
                                onConfirm={(newDate) => {
                                    setShowDate(false)
                                    setCurrentOrder({ ...currentOrder, date: newDate})
                                }}
                                onCancel={() => setShowDate(false)}
                            />
                        }
                    </View>
                    <View style={style.lineBlock}>
                        <Text style={style.text}>{`№ заказа: ${currentOrder.orderNum}`}</Text>
                        <Text style={style.text}>{`Доставка: ${currentOrder.percent}%`}</Text>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => setOpenClientScreen(true)}>
                            <Text style={[style.text, { fontWeight: 700 }]} numberOfLines={1}>
                                {`Клиент: ${currentOrderList?.clientName}`}
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
                                percent={currentOrder.percent}
                                orderItem={item}
                                deleteItem={handleDeleteOrderItem}
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
            <Modal visible={openItemFormModal}>
                    <OrderItemForm 
                        orderItem={newOrderItem}
                        onClose={handleCloseItemFormModal}
                        deleteItem={handleDeleteOrderItem}
                    />
            </Modal>
                <Modal visible={openClientScreen}>
                    <FormLayout onClose={() => setOpenClientScreen(false)} headerText='Выберите клиента'>
                        <ClientScreen select={handleSelectClient} />
                    </FormLayout>
                </Modal>
            <TotalBar statusData={statusData}/>
            <BottomBar bottomData={bottomData}/>
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
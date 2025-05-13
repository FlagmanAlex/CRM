import React, { useEffect, useState } from 'react'
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View, } from 'react-native'
import { IOrderList } from '../../../../../Interfaces/IOrderList'
import { FontAwesome } from '@expo/vector-icons'
import { IOrderItem } from '../../../../../Interfaces/IOrderItem'
import { IClient } from '../../../../../Interfaces/IClient'
import { useDispatch } from '../../../hooks/useStore'
import { selectOrderListById, updateOrderAndOrderList } from '../../../store/orderListSlice'
import { useSelector } from 'react-redux'
import { FormLayout } from '../../../shared/FormLayout'
import DatePicker from 'react-native-modal-datetime-picker'
import { OrderItemCard } from './OrderItemCard'
import { OrderItemForm } from './OrderItemForm'
import { ClientScreen } from '../ClientScreen'
import { TotalBar } from '../../TotalBar'
import { BottomBar } from '../../BottomBar'
import { fetchOrderItem, selectAllOrderItem, updateOrderItem } from '../../../store/orderItemSlice'
import { RootState } from '../../../store'
import { Invoice } from '../../Invoice'
import { ButtonStatus } from '../../../shared/Buttons/ButtonStatus'
import { OrderPayList } from './OrderPayList'
import { createPayment, selectAllPayments } from '../../../store/paymentSlice'
import { useTotalOrderItem } from '../../../hooks/useTotalOrderItem'
import { THEME } from '../../../Default'
import { IPayment, IPaymentClient } from '../../../../../Interfaces/IPayment'
import { BottomData } from '../../../types/BottomData'

interface OrderFormProps {
    orderList: IOrderList
    onClose: () => void
}

interface IStatusData {
    key: string, sum: number
}

export const OrderForm = ({ onClose, orderList }: OrderFormProps) => {
    const dispatch = useDispatch()

    const currentOrderList: IOrderList = useSelector((state: RootState) => selectOrderListById(state, orderList._id))
    const orderItems: IOrderItem[] = useSelector(selectAllOrderItem)
    const paymentsOrder: IPayment[] = useSelector(selectAllPayments)
        .filter(payment => payment.clientId === orderList.clientId)


    const newOrderItem: IOrderItem = {
        dateTo: new Date().toISOString(),
        deliveryPost: 0,
        discountPrice: 0,
        item: '',
        orderId: orderList._id,
        payment: 0,
        price: 0,
        pvzId: '67f3df5c495694051241965b',
        quantity: 0,
        ord: false,
        pai: false,
        rec: false,
        ship: false
    }


    const [openItemFormModal, setOpenItemFormModal] = useState<boolean>(false)
    const [openClientScreen, setOpenClientScreen] = useState<boolean>(false)
    const [openInvoice, setOpenInvoice] = useState<boolean>(false)
    const [openPayment, setOpenPayment] = useState<boolean>(false)
    const [showDate, setShowDate] = useState<boolean>(false)
    const [status, setStatus] = useState({ ord: false, pai: false, rec: false, ship: false })
    const {
        OrderItemsPriceSum,
        OrderItemsDiscountSum,
        AdditionalSum,
        DeliveryItemsSum
    } = useTotalOrderItem(orderItems, orderList)



    const orderSum = OrderItemsPriceSum()
    const discountPriceSum = OrderItemsDiscountSum()
    const deliverySum = DeliveryItemsSum()
    const additionalSum = AdditionalSum()


    //Получаем сумму для оплаты
    const paySum = orderSum + deliverySum + additionalSum
    //Получаем уже оплаченные суммы
    const paymentSum = paymentsOrder.reduce((total, payment) => { return total + payment.sum }, 0)

    //Остаток оплаты. Не должна быть меньше или равно нулю. Иначе переплата по заказу.
    const balance = paySum - paymentSum

    const statusData: IStatusData[] = [
        { key: 'Зак', sum: orderSum || 0 },
        { key: 'Дост', sum: deliverySum },
        { key: 'КОпл', sum: paySum },
        { key: 'Опл', sum: paymentSum },
    ]

    additionalSum ? statusData.push({ key: 'Доп', sum: additionalSum }) : null

    const bottomData: BottomData = [
        { icons: 'list-alt', action: () => handleShowInvoice() }
    ]

    const handleShowInvoice = () => {
        setOpenInvoice(() => !openInvoice)
    }

    const handleItemFormModal = () => {
        setOpenItemFormModal(false)
    }

    const handleSelectClient = async (client: IClient) => {
        if (client._id &&
            currentOrderList) {
            const orderListUpdate: IOrderList = {
                ...currentOrderList,
                clientId: client._id,
                clientName: client.name,
                percent: client.percent,
                discountSum: discountPriceSum,
                priceSum: orderSum,

            }

            console.log('Обновление клиента в заказе ', orderListUpdate);
            dispatch(updateOrderAndOrderList(orderListUpdate))
            setOpenClientScreen(false)
        }
    }

    const handleAllOrd = () => {
        orderItems.map((item) => {
            const updOrderItem: IOrderItem = {
                ...item,
                ord: !status.ord
            }
            dispatch(updateOrderItem(updOrderItem))
        })
        setStatus({ ...status, ord: !status.ord })
    }
    const handleAllPai = () => {
        if (balance > 0) {
            dispatch(createPayment({
                clientId: orderList.clientId,
                clientName: orderList.clientName,
                orderId: orderList._id,
                orderNum: orderList.orderNum,
                date: new Date().toISOString(),
                sum: balance
            }))
        }
    }
    const handleAllRec = () => {
    }
    const handleAllShip = () => {
    }

    useEffect(() => {
        dispatch(fetchOrderItem(orderList._id))
    }, [orderList])

    useEffect(() => {
        if (orderSum >= 10000) {
            const orderListUpdate: IOrderList = { ...currentOrderList, percent: 10 }
            dispatch(updateOrderAndOrderList(orderListUpdate))
        }
    }, [orderSum, currentOrderList])

    return currentOrderList ?
        <FormLayout headerText={`Заказ ${currentOrderList.orderNum} - orderForm`} onClose={onClose} >
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
                                const orderListUpdate = { ...currentOrderList, date: newDate.toISOString() }
                                dispatch(updateOrderAndOrderList(orderListUpdate))
                                setShowDate(false)
                            }}
                            onCancel={() => setShowDate(false)}
                        />
                    }
                </View>
                <View style={style.lineBlock}>
                    <Text style={style.text}>{`№ заказа: ${currentOrderList.orderNum}`}</Text>
                    <Text style={style.text}>{`Доставка: ${currentOrderList.percent}%`}</Text>
                </View>
                <View>
                    <TouchableOpacity onPress={() => setOpenClientScreen(true)}>
                        <Text style={[style.text, { fontWeight: 700 }]} numberOfLines={1}>
                            {`Клиент: ${currentOrderList.clientName}`}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={style.lineBlock}>
                    <ButtonStatus name='зак' onPress={handleAllOrd} enabled={status.ord} />
                    <ButtonStatus name='оплатить' onPress={handleAllPai} enabled={status.pai} />
                </View>
            </View>
            <FlatList
                data={orderItems}
                renderItem={({ item }) =>
                    <View style={style.card}>
                        <OrderItemCard
                            key={item._id}
                            // percent={currentOrderList.percent}
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
            <Modal visible={openItemFormModal}>
                <OrderItemForm
                    orderItem={newOrderItem}
                    onClose={handleItemFormModal}
                />
            </Modal>
            <Modal visible={openClientScreen}>
                <FormLayout onClose={() => setOpenClientScreen(false)} headerText='Выберите клиента'>
                    <ClientScreen select={handleSelectClient} />
                </FormLayout>
            </Modal>
            <Modal visible={openInvoice}>
                <FormLayout
                    onClose={() => setOpenInvoice(false)} headerText='Чек на оплату'
                >
                    <Invoice orderItems={orderItems} />
                </FormLayout>
            </Modal>
            <Modal visible={openPayment}>
                <FormLayout
                    onClose={() => setOpenPayment(false)}
                    headerText='Оплата'
                >
                    <OrderPayList />
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
        borderStyle: 'solid',
        borderRadius: 1,
        elevation: 1,
        padding: 10,
    },
})
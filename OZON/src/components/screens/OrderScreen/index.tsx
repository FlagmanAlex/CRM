import React, { useEffect, useLayoutEffect, useState } from 'react'
import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { IOrderList } from '../../../../../Interfaces/IOrderList'
import { IOrder } from '../../../../../Interfaces/IOrder'
import { OrderCard } from './OrderCard'
import { MaterialIcons } from '@expo/vector-icons'
import { OrderForm } from './OrderForm'
import { BottomBar } from '../../BottomBar'
import { TotalBar } from '../../TotalBar'
import { useDispatch } from '../../../hooks/useStore'
import { addOrderList, fetchOrderLists, selectAllOrderList } from '../../../store/orderListSlice'
import { useSelector } from 'react-redux'
import { createOrder } from '../../../store/orderSlice'
import { useTotalOrder } from '../../../hooks/useTotalOrder'
import { fetchPayments, selectAllPayments } from '../../../store/paymentSlice'
import { SerachBar } from '../../SerachBar'
import { DatePickerBar } from '../../DatePickerBar'

type IconName = React.ComponentProps<typeof MaterialIcons>["name"]

type BottomData = Array<{ icons: IconName, action: () => void }>

interface IStatusBarData {
    key: string, sum: number
}


export const OrderScreen = () => {

    const currentDate = new Date()
    const oneDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const orderLists = useSelector(selectAllOrderList)
    const payments = useSelector(selectAllPayments)

    const { OrderDeliverySum, OrderPriceSum } = useTotalOrder(orderLists)

    const [startDate, setStartDate] = useState<string>(oneDate.toISOString())
    const [endDate, setEndDate] = useState<string>(currentDate.toISOString())
    const [searchText, setSearchText] = useState('')
    const [newOrderList, setNewOrderList] = useState<IOrderList>()

    const [filteredOrders, setFilteredOrders] = useState<IOrderList[]>(orderLists)

    const bottomData: BottomData = [
        { icons: 'library-add', action: () => handleNewOrder() },
    ]

    const [openModal, setOpenModal] = useState<boolean>(false)

    const dispatch = useDispatch()

    const zak = OrderPriceSum()
    const dost = OrderDeliverySum()

    const statusBarData: IStatusBarData[] = [
        { key: 'Кол', sum: orderLists.length },
        { key: 'Зак', sum: zak },
        { key: 'Дос', sum: dost },
        { key: 'КОпл', sum: zak + dost },
        { key: 'Опл', sum: zak + dost },
    ]

    const handleClose = () => {
        setOpenModal(false)
    }
    const handlefilterString = (filterString: string) => {
        setSearchText(filterString)

        const filtered = orderLists.filter((order) =>
            order.clientName?.toLowerCase().includes(filterString.toLowerCase())
        )
        setFilteredOrders(filtered)
    }

    //Создание нового документа
    const handleNewOrder = async () => {
        // Шаблон нового документа с полями по умолчанию. Проверять с моделью базы.

        const createOrderAction = await dispatch(createOrder())
        if (createOrder.fulfilled.match(createOrderAction)) {
            const createdOrder: IOrder = createOrderAction.payload

            //Формируем локальный стейт OrderList на базе полученного Order
            const updatedNewOrderList: IOrderList = {
                ...createdOrder,
                discountSum: 0,
                priceSum: 0,
                clientName: '<Клиент не выбран>',
                _id: createdOrder._id || '',
                percent: 15
            }

            await dispatch(addOrderList(updatedNewOrderList))
            setNewOrderList(updatedNewOrderList)

            setOpenModal(true)
        }

    }

    useEffect(() => {
        dispatch(fetchPayments())
    }, [payments])

    useLayoutEffect(() => {
        const responseDB = async () => {
            const date = {
                startDate: startDate,
                endDate: endDate
            }
            dispatch(fetchOrderLists(date))
        }
        responseDB()
    }, [startDate, endDate, dispatch])

    useEffect(() => {
        const filtered = orderLists.filter((order) =>
            order.clientName?.toLowerCase().includes(searchText.toLowerCase())
        )

        setFilteredOrders(filtered || [])

    }, [orderLists, searchText])

    return (
        <View style={style.contentLayout}>
            <View style={style.controlLayout}>
                <DatePickerBar
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                />
                <SerachBar
                    placeholder='Введите имя клиента'
                    searchText={searchText}
                    setSearchText={handlefilterString}
                />
            </View>

            {orderLists.length > 0 ? (
                <View
                    style={style.scrollLayout}
                >
                    <FlatList
                        data={filteredOrders}
                        renderItem={({ item }) =>
                            item ? <OrderCard orderList={item} /> : null
                        }
                        keyExtractor={(item, index) => item._id ?? index.toString()}
                        contentContainerStyle={{ flexGrow: 1, padding: 5 }}
                    />
                </View>
            ) :
                <View style={style.image}>
                    <Image source={require('../../../../assets/NoItems.png')} />
                </View>
            }
            {newOrderList ?
                <Modal visible={openModal}>
                    <OrderForm
                        orderList={newOrderList}
                        onClose={handleClose}
                    />
                </Modal>
                : null}
            <View>
                <TotalBar statusData={statusBarData} />
                <BottomBar bottomData={bottomData} />
            </View>
        </View >
    )
}

const style = StyleSheet.create({
    image: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentLayout: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    controlLayout: {
        // flex: 1
    },
    scrollLayout: {
        flex: 1,
    },
    //-----------------------------------------
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
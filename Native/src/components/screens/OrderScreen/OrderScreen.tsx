import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Alert, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import DatePicker from 'react-native-modal-datetime-picker'
import { IOrderList } from '../../../../../Interfaces/IOrderList'
import { IOrder } from '../../../../../Interfaces/IOrder'
import { OrderCard } from './OrderCard/OrderCard'
import { TextField } from '../../../shared/TextField'
import { getOrderDeliverySumTotal, getOrderPriceSumTotal, host, port } from '../../../Default'
import { MaterialIcons } from '@expo/vector-icons'
import { OrderForm } from './OrderCard/OrderForm/OrderForm'
import { BottomBar } from '../../BottomBar'
import { TotalBar } from '../../TotalBar'
import { useDispatch } from '../../../store/customHooks'
import { addOrderList, deleteOrderList, fetchOrderLists, selectAllOrderList } from '../../../store/orderListSlice'
import { useSelector } from 'react-redux'
import { createOrder } from '../../../store/orderSlice'
// import { RootStore } from '../../../store'

type IconName = React.ComponentProps<typeof MaterialIcons>["name"]

type BottomData = Array<{ icons: IconName, action: () => void }>

interface IStatusData {
    key: string, sum: number
}


export const OrderScreen = () => {

    const orderLists = useSelector(selectAllOrderList)

    const now = new Date()

    const [startDate, setStartDate] = useState<string>(new Date(now.getFullYear(), now.getMonth(), 1).toISOString())
    const [endDate, setEndDate] = useState<string>(new Date().toISOString())
    const [showStartDate, setShowStartDate] = useState<boolean>(false)
    const [showEndDate, setShowEndDate] = useState<boolean>(false)
    const [searchText, setSearchText] = useState('')
    const [newOrderList, setNewOrderList] = useState<IOrderList>()

    const [filteredOrders, setFilteredOrders] = useState<IOrderList[]>(orderLists)

    const bottomData: BottomData = [
        { icons: 'library-add', action: () => handleNewOrder() },
    ]

    const [openModal, setOpenModal] = useState<boolean>(false)

    const dispatch = useDispatch()

    const statusData: IStatusData[] = [
        { key: 'Зак', sum: getOrderPriceSumTotal(orderLists) },
        { key: 'Дост', sum: getOrderDeliverySumTotal(orderLists) },
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
                <View style={style.dateBlock}>

                    {/********* Дата начала периода ***********/}
                    <TouchableOpacity onPress={() => setShowStartDate(true)}>
                        <Text
                            style={style.text}
                        >
                            {` c: `}
                            <Text
                                style={style.textDate}
                            >
                                {new Date(startDate).toLocaleDateString()}
                            </Text>
                        </Text>
                    </TouchableOpacity>
                    <DatePicker
                        date={startDate ? new Date(startDate) : new Date()}
                        isVisible={showStartDate}
                        onConfirm={(newDate) => {
                            setShowStartDate(false)
                            setStartDate(newDate.toISOString())
                        }}
                        onCancel={() => setShowStartDate(false)}
                    />
                    {/****************************************/}

                    {/********* Дата конца периода ***********/}
                    <TouchableOpacity onPress={() => setShowEndDate(true)}>
                        <Text
                            style={style.text}
                        >
                            {` по: `}
                            <Text
                                style={style.textDate}
                            >
                                {new Date(endDate).toLocaleDateString()}
                            </Text>
                        </Text>
                    </TouchableOpacity>
                    <DatePicker
                        date={new Date(endDate)}
                        isVisible={showEndDate}
                        onConfirm={(newDate) => {
                            setShowEndDate(false)
                            setEndDate(newDate.toISOString())
                        }}
                        onCancel={() => setShowEndDate(false)}
                    />
                    {/****************************************/}

                </View>

                {/* --------------------------------------------- */}

                <View style={style.searchBlock}>
                    <TextField
                        placeholder='Введите имя клиента'
                        value={searchText}
                        onChangeText={handlefilterString}
                        type='Date'
                    ></TextField>
                </View>
            </View>

            {/* --------------------------------------------- */}

            {/* <ScrollView style={style.scrollLayout}> */}
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
                    <Image
                        // style={{alignItems: 'center', justifyContent: 'center' }}
                        source={require('../../../../assets/NoItems.png')}
                    />
                </View>
            }
            {/* </ScrollView > */}
            {newOrderList ?
                <Modal visible={openModal}>
                    <OrderForm
                        orderList={newOrderList}
                        onClose={handleClose}
                    />
                </Modal>
                : null}
            <View>
                <TotalBar statusData={statusData} />
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
    dateBlock: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        elevation: 1

    },
    searchBlock: {

    },
    text: {
        fontSize: 20
    },
    textDate: {
        textDecorationLine: 'underline'
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
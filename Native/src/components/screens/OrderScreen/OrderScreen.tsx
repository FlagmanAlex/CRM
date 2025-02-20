import React, { useEffect, useState } from 'react'
import { Alert, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import DatePicker from 'react-native-modal-datetime-picker'
import axios from 'axios'
import { IOrderList } from '../../../../../Interfaces/IOrderList'
import { IOrder } from '../../../../../Interfaces/IOrder'
import { OrderCard } from './OrderCard/OrderCard'
import { TextField } from '../../../shared/TextField'
import { getOrderDeliverySumTotal, getOrderPriceSumTotal, SETTINGS } from '../../../Default'
import { useContextData } from '../../../ContextProvider'
import { MaterialIcons } from '@expo/vector-icons'
import { OrderForm } from './OrderCard/OrderForm/OrderForm'
import { BottomBar } from '../../BottomBar'
import { TotalBar } from '../../TotalBar'

type IconName = React.ComponentProps<typeof MaterialIcons>["name"]

type BottomData = Array<{ icons: IconName, action: () => void }>

interface IStatusData {
    key: string, sum : number
  }

  
export const OrderScreen = () => {

    const [startDate, setStartDate] = useState<Date>(new Date('2025-01-14'))
    const [endDate, setEndDate] = useState<Date>(new Date())
    const [showStartDate, setShowStartDate] = useState<boolean>(false)
    const [showEndDate, setShowEndDate] = useState<boolean>(false)
    const [searchText, setSearchText] = useState('')
    const [newOrderList, setNewOrderList] = useState<IOrderList>()

    const { orderLists, setOrderLists } = useContextData()
    const [filteredOrders, setFilteredOrders] = useState<IOrderList[]>(orderLists)

    const bottomData: BottomData = [
            {icons: 'library-add', action: () => handleNewOrder()},
        ]

    const [openModal, setOpenModal] = useState<boolean>(false)

    const statusData: IStatusData[] = [
        {key: 'Зак', sum: getOrderPriceSumTotal(orderLists)},
        {key: 'Дост', sum: getOrderDeliverySumTotal(orderLists)},
    ]
    const server = `${SETTINGS.host}:${SETTINGS.port}`


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
        const newOrderTemp: IOrder = {
            // _id: '',
            orderNum: 0,
            clientId: '67a7515e37cffbc78d0d7e35',
            date: new Date(),
            percent: 15,
        }

        try {
            //Получаем из базы следующий за последним номер накладной
            const respOrderNum = await axios.get(`${server}/api/order/getOrderNum`)
            const orderNum: number = respOrderNum.data.orderNum
            //Добавляем номер накладной к шаблону нового документа
            const newOrder: IOrder = { ...newOrderTemp, orderNum: orderNum }

            //Создаем новый документ в базе и получаем его экземпляр Order ответом
            const response = await axios.post(`${server}/api/order/`, newOrder)
            const createdOrder: IOrder = response.data;
            
            //Формируем локальный стейт OrderList на базе полученного Order
            const updatedNewOrderList = {
                ...createdOrder,
                discountSum: 0,
                priceSum: 0,
                clientName: '<Клиент не выбран>',
                _id: createdOrder._id || '',
                percent: 15
            }
            setNewOrderList(updatedNewOrderList)


            if (orderLists) {
                //Добавляем в список OrderLists локальный стейт OrderList и открываем форму накладной.
                const updatedOrderLists: IOrderList[] = [...orderLists, updatedNewOrderList];
                setOrderLists(updatedOrderLists);
                // console.log('Update Orders:', updatedOrders);
                setOpenModal(true)
            }

        } catch (error) {
            Alert.alert('Ошибка', 'Не удалось создать новый заказ')
        }
    }

    const handleDeleteOrder = async (orderId: string) => {
        try {
            await axios.delete(`${server}/api/order/${orderId}`)
            const updateOrders = orderLists.filter(order => order._id !== orderId)
            setOrderLists(updateOrders)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.data && error.response.data.message) {
                    Alert.alert('Внимание!!!', `${error.response.data.message}`)
                }
            }
        }
    }

    useEffect(() => {

        const responseDB = async () => {
            try {
                //Получение списка документов с суммами. Итоги OrderLists читаются на сервере
                const response = await axios.get(`${server}/api/order/OrderLists`, {
                    params: {
                        startDate: startDate.toISOString(),
                        endDate: endDate.toISOString()
                    }
                })
                //Обновление глобального стейта OrderLists
                setOrderLists(response.data)
                setFilteredOrders(response.data)
            } catch (error) {
                Alert.alert("Ошибка загрузки данных")
            }
        }

        responseDB()
        //Одновляется при изменении рабочего периода
    }, [startDate, endDate])

    useEffect(() => {

        const filtered = orderLists.filter((order) => 
            order.clientName?.toLowerCase().includes(searchText.toLowerCase())
        )

        setFilteredOrders(filtered || [])
    }, [orderLists])

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
                                {startDate.toLocaleDateString()}
                            </Text>
                        </Text>
                    </TouchableOpacity>
                    <DatePicker
                        date={startDate}
                        isVisible={showStartDate}
                        onConfirm={(newDate) => {
                            setShowStartDate(false)
                            setStartDate(newDate)
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
                                {endDate.toLocaleDateString()}
                            </Text>
                        </Text>
                    </TouchableOpacity>
                    <DatePicker
                        date={endDate}
                        isVisible={showEndDate}
                        onConfirm={(newDate) => {
                            setShowEndDate(false)
                            setEndDate(newDate)
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
                            <OrderCard orderList={item} deleteOrder={handleDeleteOrder} />
                        }
                        keyExtractor={(item, index) => item._id ?? index.toString()}
                        contentContainerStyle={{ flexGrow: 1, padding: 5 }}
                    />
                </View>
            ) : 
                <View style={style.image}>
                    <Image 
                        // style={{alignItems: 'center', justifyContent: 'center' }}
                        source={ require('../../../../assets/NoItems.png') }
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
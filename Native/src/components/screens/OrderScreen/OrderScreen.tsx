import React, { useEffect, useState } from 'react'
import { Alert, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import DatePicker from 'react-native-modal-datetime-picker'
import axios from 'axios'
import { IOrderList } from '../../../../../Interfaces/IOrderList'
import { IOrder } from '../../../../../Interfaces/IOrder'
import { OrderCard } from './OrderCard/OrderCard'
import { TextField } from '../../../shared/TextField'
import { SETTINGS } from '../../../Default'
import { useContextData } from '../../../ContextProvider'
import { MaterialIcons } from '@expo/vector-icons'
import { OrderForm } from './OrderCard/OrderForm/OrderForm'
import { BottomBar } from '../../BottomBar'

type IconName = React.ComponentProps<typeof MaterialIcons>["name"]

type BottomData = Array<{ icons: IconName, action: () => void }>
  
export const OrderScreen = () => {

    const [startDate, setStartDate] = useState<Date>(new Date('2025-01-14'))
    const [endDate, setEndDate] = useState<Date>(new Date())
    const [showStartDate, setShowStartDate] = useState<boolean>(false)
    const [showEndDate, setShowEndDate] = useState<boolean>(false)
    const [searchText, setSearchText] = useState('')
    const [newOrderList, setNewOrderList] = useState<IOrderList>()

    const { orderLists, setOrderLists } = useContextData()

    const bottomData: BottomData = [
            {icons: 'library-add', action: () => handleNewOrder()},
        ]

    const [openModal, setOpenModal] = useState<boolean>(false)

    const handleClose = () => {
        setOpenModal(false)
    }


    const server = `${SETTINGS.host}:${SETTINGS.port}`

    const handlefilterString = (filterString: string) => {
        setSearchText(filterString)
        // orderLists.filter(item =>
        //     item.clientName &&
        //     item.clientName.toLowerCase().includes(filterString.toLowerCase())
        // )
    }

    const handleNewOrder = async () => {
        const newOrderTemp: IOrder = {
            // _id: '',
            orderNum: 0,
            clientId: '67a7515e37cffbc78d0d7e35',
            date: new Date(),
            percent: 15,
        }

        try {
            const respOrderNum = await axios.get(`${server}/api/order/getOrderNum`)
            const orderNum: number = respOrderNum.data.orderNum
            const newOrder: IOrder = { ...newOrderTemp, orderNum: orderNum }

            const response = await axios.post(`${server}/api/order/`, newOrder)
            const createdOrder: IOrder = response.data;
            
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
                    Alert.alert('Ошибка', `${error.response.data.message}`)
                }
            }
        }
    }

    const handleUpdateOrder = async (newOrder: IOrder) => {
        try {
            const response = await axios.put(`${server}/api/order/${newOrder._id}`, newOrder)
            const updateOrder = response.data
            // const updateOrders = orderLists.map(order => order._id === orderId ? { ...order, ...updateOrder } : order)
            // setOrders(updateOrders)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.data && error.response.data.message) {
                    Alert.alert('Ошибка', `${error.response.data.message}`)
                }
            }
        }
    }

    useEffect(() => {

        const responseDB = async () => {
            try {
                const response = await axios.get(`${server}/api/order/OrderLists`, {
                    params: {
                        startDate: startDate.toISOString(),
                        endDate: endDate.toISOString()
                    }
                })
                setOrderLists(response.data)
            } catch (error) {
                Alert.alert("Ошибка загрузки данных")
            }
        }

        responseDB()
        // setFilterOrder(orderLists)

    }, [startDate, endDate])

    // useEffect(() => {
    //         orderLists.filter(item =>
    //             item.clientName &&
    //             item.clientName.toLowerCase().includes(searchText.toLowerCase())
    //     );
    // }, [orderLists, searchText]); // Зависимости: orders и searchText    

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
                        data={
                            orderLists
                                .filter(orderf =>
                                    orderf.clientName &&
                                    orderf.clientName
                                        .toLowerCase()
                                        .includes(searchText.toLowerCase())
                                )
                        }
                        renderItem={({ item }) =>
                            <OrderCard order={item} deleteOrder={handleDeleteOrder} />
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
                        order={newOrderList}
                        onClose={handleClose}
                    />
                </Modal>
                : null}
            <BottomBar bottomData={bottomData} />
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
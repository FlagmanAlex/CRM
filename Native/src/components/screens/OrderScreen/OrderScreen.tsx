import React, { useEffect, useState } from 'react'
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import DatePicker from 'react-native-modal-datetime-picker'
import axios from 'axios'
import { IOrderList } from '../../../../../Interfaces/IOrderList'
import { IOrder } from '../../../../../Interfaces/IOrder'
import { OrderCard } from './OrderCard/OrderCard'
import { TextField } from '../../../shared/TextField'
import { SETTINGS, THEME } from '../../../Default'
import { useContextData } from '../../../ContextProvider'
import { FontAwesome } from '@expo/vector-icons'
import { OrderForm } from './OrderCard/OrderForm/OrderForm'


export const OrderScreen = () => {

    const [startDate, setStartDate] = useState<Date>(new Date('2025-01-14'))
    const [endDate, setEndDate] = useState<Date>(new Date())
    const [showStartDate, setShowStartDate] = useState<boolean>(false)
    const [showEndDate, setShowEndDate] = useState<boolean>(false)
    const [searchText, setSearchText] = useState('')
    const [filterOrder, setFilterOrder] = useState<IOrderList[]>([])

    const { orders, setOrders } = useContextData()
    const [ order, setOrder ] = useState<IOrderList>({
        orderNum: 0,
        clientId: '',
        date: new Date(),
        percent: 15,
        clientName: '',
        discountSum: 0,
        priceSum: 0,
        _id: ''
    })
    

    const [openModal, setOpenModal] = useState<boolean>(false)

    const handleClose = () => {
        setOpenModal(false)
    }

    const handleNewOrderForm = async () => {
        setOpenModal(true)
        const respons = await axios.post(`${server}/api/order/getOrderNum`)
        console.log(respons.data);

        const orderTemp : IOrder = {
            clientId: '',
            date: new Date(),
            orderNum: respons.data.orderNum,
            percent: 15
        }

        const newOrder = await axios.post(`${server}/api/order/`, orderTemp)
        setOrder({ ...order, orderNum: newOrder.data.orderNum, _id: newOrder.data._id })
        
    }

    const server = `${SETTINGS.host}:${SETTINGS.port}`

    const handlefilterString = (filterString: string) => {
        setSearchText(filterString)
        setFilterOrder(
            orders.filter(item =>
                item.clientName &&
                item.clientName.toLowerCase().includes(filterString.toLowerCase())
            )
        )
    }


    useEffect(() => {

        const responseDB = async () => {
            try {
                const response = await axios.get(`${server}/api/order`, {
                    params: {
                        startDate: startDate.toISOString(),
                        endDate: endDate.toISOString()
                    }
                })
                setOrders(response.data)
            } catch (error) {
                Alert.alert("Ошибка загрузки данных")
            }
        }

        responseDB()
        setFilterOrder(orders)

    }, [startDate, endDate, filterOrder])

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

            <ScrollView style={style.scrollLayout}>
                {orders.length > 0 ? (
                    <View>
                        {orders
                            .filter(orderf =>
                                orderf.clientName &&
                                orderf.clientName
                                    .toLocaleLowerCase()
                                    .includes(searchText.toLocaleLowerCase())
                            )
                            .map((order) => (
                                <OrderCard key={order._id} order={order} />
                            ))}
                            <View style={style.newCard}>
                                <TouchableOpacity onPress={handleNewOrderForm}>
                                    <FontAwesome
                                        name='plus'
                                        size={45}
                                        color={THEME.color.grey}
                                    />
                                </TouchableOpacity>
                            </View>
                    </View>
                ) : <Text>Нет заказов в выбранном периоде</Text>
                }
            </ScrollView >
            {order ?
                <Modal visible={openModal}>
                    <OrderForm
                        order={order}
                        onClose={handleClose}
                    />
                </Modal>
                : null}
        </View >
    )
}

const style = StyleSheet.create({
    contentLayout: {
        // width: '100%',
    },
    controlLayout: {
        // flex: 1
    },
    scrollLayout: {
        padding: 5,
        height: '100%',
        marginBottom: 20
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
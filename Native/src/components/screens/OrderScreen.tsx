import React, { useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import DatePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import axios from 'axios'
import { IOrderList } from '../../../../Interfaces/IOrderList'
import { OrderCard } from '../OrderCard'
import { TextField } from '../../shared/TextField'
import { SETTINGS, THEME } from '../../Default'
import { IOrderItem } from '../../../../Interfaces/IOrderItem'
import { useContextData } from '../../ContextProvider'


export const OrderScreen = () => {

    const [startDate, setStartDate] = useState<Date>(new Date('2025-01-14'))
    const [endDate, setEndDate] = useState<Date>(new Date())
    const [showStartDate, setShowStartDate] = useState<boolean>(false)
    const [showEndDate, setShowEndDate] = useState<boolean>(false)
    const [searchText, setSearchText] = useState('')
    const [filterOrder, setFilterOrder] = useState<IOrderList[]>([])

    const { orders, setOrders } = useContextData()
    
    const server = `${SETTINGS.host}:${SETTINGS.port}`

    const handleChangeStartDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || startDate
        setShowStartDate(false);
        setStartDate(currentDate);
    };
    const handleChangeEndDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || startDate
        setShowEndDate(false);
        setEndDate(currentDate);
    };

    const handlefilterString = (filterString: string) => {
        setSearchText(filterString)
        setFilterOrder(
            orders.filter(item => 
              item.clientName &&
              item.clientName.toLowerCase().includes(filterString.toLowerCase())
            )
          )
      }
  

    useEffect (() => {

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

    },[startDate, endDate, filterOrder])

    return (
        <View style={style.contentLayout}>
            <View style={style.controlLayout}>
                <View style={style.dateBlock}>
                    <TouchableOpacity onPress={() => setShowStartDate(true)}>
                        <Text
                            style={style.text}
                        >{`c: ${startDate.toLocaleDateString()}`}</Text>
                    </TouchableOpacity>
                    {showStartDate && (
                        <DatePicker
                            style={{ 
                                borderColor: THEME.color.grey, 
                                borderStyle: 'dotted',
                                borderBlockColor: THEME.color.black
                            }}
                            value={startDate}
                            mode="date"
                            onChange={handleChangeStartDate}
                            
                        />
                    )}
                    <TouchableOpacity onPress={() => setShowEndDate(true)}>
                        <Text style={style.text}>{` по: ${endDate.toLocaleDateString()}`}</Text>
                    </TouchableOpacity>
                    {showEndDate && (
                        <DatePicker
                            value={endDate}
                            onChange={handleChangeEndDate}
                        />
                    )}
                </View>
                <View style={style.searchBlock}>
                    <TextField 
                        placeholder='Введите имя клиента'
                        value={searchText}
                        onChangeText={handlefilterString}
                    ></TextField>
                </View>
            </View>
            <ScrollView style={style.scrollLayout}>
                {orders.length > 0 ?
                orders.filter((orderf => 
                orderf.clientName && 
                orderf.clientName
                  .toLocaleLowerCase()
                  .includes(searchText
                  .toLocaleLowerCase())))
  
                    .map((order) => (
                        <OrderCard key={order._id} order={order} />
                    )
                ) : <Text>Нет заказов в выбранном периоде</Text>}
            </ScrollView>
        </View>
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
        // flex: 1,
        padding: 5,
        height: '100%',
        marginBottom: 20
    },
    dateBlock: {
        // display: 'none',
        flexDirection: 'row',
        justifyContent: 'center',
        // borderBottomWidth: 1,
        padding: 10,
        elevation: 1
        
    },
    searchBlock: {

    },
    text: {
        fontSize: 20
    }
})
import React, { useState } from 'react'
import { Alert, Modal, StyleSheet, Text, TextInput, View } from 'react-native'
import { FormLayout } from '../../shared/FormLayout'
import { ButtonApply } from '../../shared/Buttons/ButtonApply'
import { ButtonDelete } from '../../shared/Buttons/ButtonDelete'
import { ButtonBack } from '../../shared/Buttons/ButtonBack'
import { TextField } from '../../shared/TextField'
import { IOrderItem } from '../../../../Interfaces/IOrderItem'
import axios from 'axios'
import { SETTINGS } from '../../Default'

interface OICMProps {
    orderItem: IOrderItem
    onClose: () => void
}


export const OrderItemForm = ({ onClose, orderItem }: OICMProps) => {

    const server = `${SETTINGS.host}:${SETTINGS.port}`

    const [selectOrderItem, setSelectOrderItem] = useState<IOrderItem>(orderItem)

    const fields = [
        { key: "item", placeholder: "Наименование  товара", value: selectOrderItem.item, keyboardType: "default" as const, multiline: false },
        { key: "dateTo", placeholder: "Дата доставки", value: new Date(selectOrderItem.dateTo).toLocaleDateString(), keyboardType: "number-pad" as const, multiline: false },
        { key: "quantity", placeholder: "Кол-во", value: selectOrderItem.quantity, keyboardType: "number-pad" as const, multiline: false },
        { key: "discountPrice", placeholder: "Цена со скидкой", value: selectOrderItem.discountPrice, keyboardType: "number-pad" as const, multiline: false },
        { key: "price", placeholder: "Цена", value: selectOrderItem.price, keyboardType: "number-pad" as const, multiline: false },
        { key: "url", placeholder: "Ссылка на товар", value: selectOrderItem.url, keyboardType: "url" as const, multiline: true },
    ];



    const handleFieldChange = (field: keyof IOrderItem, value: string) => {
        console.log(`Обновление ${field} в ${value}`);
        
        setSelectOrderItem((prev) => ({...prev, [field]: value}))
    }

    const handleSave = async () => {
        try {
            await axios.put(`${server}/api/order/items/${selectOrderItem._id}`, selectOrderItem)
        } catch (error) {
            Alert.alert('Ошибка сервера')
        }
        onClose()
    }

    const handleDelete = () => {
        onClose()
    }

    const handleCancel = () => {
        onClose()
    }

    return (
        <FormLayout headerText={`Карточка товара/OrderItemsFormModal`} onClose={onClose}>
            <View style={style.content}>
                <View style={style.bodyBlock}>
                    {
                        fields.length > 0 ?
                            fields.map((field, index) => (
                                <TextField
                                    value={field.value}
                                    key={index}
                                    placeholder={field.placeholder}
                                    keyboardType={field.keyboardType}
                                    onChangeText={text => handleFieldChange(field.key as keyof IOrderItem, text)}
                                    multiline={field.multiline}
                                />
                            )) : null
                    }
                </View>
                <View style={style.buttonBlock}>
                    <ButtonApply onPress={handleSave} />
                    <ButtonDelete onPress={handleDelete} />
                    <ButtonBack onPress={handleCancel} />
                </View>
            </View>
        </FormLayout>
    )
}
const style = StyleSheet.create({
    content: {
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    bodyBlock: {

    },
    buttonBlock: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        bottom: 20
    },
})
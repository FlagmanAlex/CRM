import React, { useState } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import { FormLayout } from '../../../../../../../shared/FormLayout'
import { ButtonApply } from '../../../../../../../shared/Buttons/ButtonApply'
import { ButtonDelete } from '../../../../../../../shared/Buttons/ButtonDelete'
import { ButtonBack } from '../../../../../../../shared/Buttons/ButtonBack'
import { TextField } from '../../../../../../../shared/TextField'
import { IOrderItem } from '../../../../../../../../../Interfaces/IOrderItem'
import { THEME } from '../../../../../../../Default'
import  * as yup  from "yup";
import { addOrderItem, deleteOrderItem, updateOrderItem } from '../../../../../../../store/orderItemSlice'
import { useDispatch } from '../../../../../../../store/customHooks'

interface OICMProps {
    orderItem: IOrderItem
    onClose: () => void
}


export const OrderItemForm = ({ onClose, orderItem }: OICMProps) => {

    const [selectOrderItem, setSelectOrderItem] = useState<IOrderItem>(orderItem)
    const dispatch = useDispatch()

    //Состояние для ошибок валидации yup
    const [errors, setErrors] = useState<Record<string, string>>({})

    //Схема валидации данных
    const validationSchema = yup.object().shape({
        item: yup.string().required("Наименование товара не может быть пустым"),
        quantity: yup.number()
            .typeError("Кол-во должно быть числом")
            .min(1, "Кол-во не  может быть меньше 1")
            .required("Кол-во не может быть пустым"),
        price: yup.number()
            .typeError("Цена должна быть числом")
            .min(1, "Цена не может быть меньше 0")
            .required("Цена не может быть пустой"),
        discountPrice: yup.number()
            .typeError("Цена со скидкой должна быть числом")
            .min(0, "Цена  со скидкой не может быть меньше 0")
            .test("discountPrice", "Цена со скидкой не может превышать основную цену", function (value) {
               const { price }  = this.parent
               return !value || value <= price
            }),
        url: yup.string()
            .url("Введите корректную ссылку на товар").nullable()
    })

    const fields = [
        { key: "item", placeholder: "Наименование  товара", type: 'string',  value: selectOrderItem.item, keyboardType: "default" as const, multiline: true },
        { key: "quantity", placeholder: "Кол-во", type: 'number', value: selectOrderItem.quantity, keyboardType: "number-pad" as const, multiline: false },
        { key: "discountPrice", placeholder: "Цена со скидкой", type: 'number', value: selectOrderItem.discountPrice, keyboardType: "number-pad" as const, multiline: false },
        { key: "price", placeholder: "Цена", type: 'number', value: selectOrderItem.price, keyboardType: "number-pad" as const, multiline: false },
        { key: "url", placeholder: "Ссылка на товар", type: 'string', value: selectOrderItem.url, keyboardType: "url" as const, multiline: true },
        { key: "dateTo", placeholder: "Дата доставки", type: 'date', value: selectOrderItem.dateTo, keyboardType: "number-pad" as const, multiline: false },
    ];



    const handleFieldChange = (field: keyof IOrderItem, value: string) => {
        setSelectOrderItem((prev) => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        try {
            //Валидация данных
            await validationSchema.validate(selectOrderItem, { abortEarly: false })
            setErrors({}) // Очистка всех ошибок

            if (selectOrderItem._id) {
                dispatch(updateOrderItem(selectOrderItem))
            } else {
                dispatch(addOrderItem(selectOrderItem))                
            }

            onClose()
        } catch (errorValidation) {
            //Обработка ошибок валидации
            const newError: Record<string, string> = {}
            if (errorValidation instanceof yup.ValidationError) {
                errorValidation.inner.forEach((error) => {
                    if (error.path) {
                        newError[error.path] = error.message
                    }
                })
            }
            setErrors(newError)
        }
    }

    const handleDelete = () => {
        Alert.alert(
            "Подтвердите действие", 
            "Вы уверены что хотите удалить карточку товара?",
            [
                {
                    text: "Удалить",
                    onPress: async () => {
                        if (orderItem._id) dispatch(deleteOrderItem((orderItem._id)))
                            onClose()
                    }
                },
                {
                    text: "Отмена",
                    onPress: () => console.log("Отмена удаления"),
                    style: "cancel"
                },
            ]
        )
    }

    const handleCancel = () => {
        onClose()
    }

    return (
        <FormLayout headerText={`Карточка товара`} onClose={onClose}>
            <View style={style.content}>
                <View style={style.bodyBlock}>
                    {
                        fields.length > 0 ?
                            fields.map((field, index) => (
                                <View key={index}>
                                    <TextField
                                        value={field.value}
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        keyboardType={field.keyboardType}
                                        onChangeText={text => handleFieldChange(field.key as keyof IOrderItem, text)}
                                        multiline={field.multiline}
                                    />
                                    {<Text style={{
                                        paddingLeft: 10,  
                                        color: THEME.color.red, 
                                        fontWeight: 800 }}
                                    >{errors[field.key]}</Text>}
                                </View>
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
        flex: 1,
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: 10,
    },
    bodyBlock: {
        // gap: 15
    },
    buttonBlock: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        bottom: 20,
    },
})

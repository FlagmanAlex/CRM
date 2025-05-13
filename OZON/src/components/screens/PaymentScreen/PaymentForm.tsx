import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FormLayout } from '../../../shared/FormLayout'
import { IPayment, IPaymentClient } from '../../../../../Interfaces/IPayment'

interface IPaymentFormProps {
    payment?: IPayment
}

export const PaymentForm = ({ payment }: IPaymentFormProps) => {
    return (
        <Text>{payment ? payment.sum : ''}</Text>
    )
}

const styles = StyleSheet.create({

})
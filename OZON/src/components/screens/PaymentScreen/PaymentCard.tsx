import { Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useState } from 'react'
import { IPayment, IPaymentClient } from '../../../../../Interfaces/IPayment'
import { THEME } from '../../../Default'
import { FormLayout } from '../../../shared/FormLayout'
import { PaymentForm } from './PaymentForm'
import { useDispatch } from '../../../hooks/useStore'
import { deletePayment } from '../../../store/paymentSlice'

interface IPaymentCardProps {
    payment: IPayment
    // clientName: string | undefined
}

export const PaymentCard = ({ payment }: IPaymentCardProps) => {

    const dispatch = useDispatch()
    const [openPaymentModal, setOpenPaymentModal] = useState<boolean>(false)
    // console.log(payment);

    const deletePayHandler = () => {
        console.log(payment);

        dispatch(deletePayment(payment._id!))
    }

    return (
        <View style={styles.card}>
            <TouchableOpacity
                onPress={() => setOpenPaymentModal(true)}
                onLongPress={deletePayHandler}
            >
                <View style={styles.content}>
                    <Text style={[styles.text, { flex: 5 }]}>{new Date(payment.date).toLocaleDateString()}</Text>
                    <Text style={[styles.text, { flex: 10 }]} >{payment.clientName}</Text>
                    <Text style={[styles.text, { flex: 2, textAlign: 'right' }]} >{payment.orderNum}</Text>
                    <Text style={[styles.text, { flex: 3, textAlign: 'right' }]}>{payment.sum.toFixed(0)}</Text>
                </View>
            </TouchableOpacity>
            <Modal visible={openPaymentModal}>
                <FormLayout headerText={`Оплата`} onClose={() => setOpenPaymentModal(false)} >
                    <PaymentForm payment={payment} />
                </FormLayout>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: THEME.color.grey,
        padding: 5
    },
    content: {
        flexDirection: 'row',
    },
    text: {
        fontSize: 16,
        borderStyle: 'dotted',
        borderColor: 'grey',
        borderLeftWidth: 1,
        paddingHorizontal: 2

    },
})
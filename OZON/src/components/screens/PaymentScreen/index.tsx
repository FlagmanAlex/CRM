import { Modal, StyleSheet, View, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DatePickerBar } from '../../DatePickerBar'
import { SerachBar } from '../../SerachBar'
import { PaymentCard } from './PaymentCard'
import { useSelector } from 'react-redux'
import { fetchPayments, selectAllPayments } from '../../../store/paymentSlice'
import { useDispatch } from '../../../hooks/useStore'
import { IPayment, IPaymentClient } from '../../../../../Interfaces/IPayment'
import { BottomBar } from '../../BottomBar'
import { BottomData } from '../../../types/BottomData'
import { PaymentForm } from './PaymentForm'
import { FormLayout } from '../../../shared/FormLayout'
import { fetchClient, selectAllClients } from '../../../store/clientSlice'
import { IClient } from '../../../../../Interfaces/IClient'

export const PaymentScreen = () => {

    const dispatch = useDispatch()
    const currentDate = new Date()
    const oneDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const [startDate, setStartDate] = useState<string>(oneDate.toISOString())
    const [endDate, setEndDate] = useState<string>(currentDate.toISOString())
    const [searchText, setSearchText] = useState<string>('')
    const payments: IPayment[] = useSelector(selectAllPayments)
    const clients: IClient[] = useSelector(selectAllClients)
    const [openPaymentModal, setOpenPaymentModal] = useState<boolean>(false)
    // const clients = useSelector(selectAllClients)

    const bottomData: BottomData = [
        { icons: 'add', action: () => setOpenPaymentModal(true) }
    ]

    useEffect(() => {
        const responseDB = () => {
            dispatch(fetchPayments())
            dispatch(fetchClient())
        }

        responseDB()

    }, [])

    return (
        <View style={styles.content}>
            <View>
                <DatePickerBar
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                />
                <SerachBar
                    placeholder='Введите имя клиента'
                    searchText={searchText}
                    setSearchText={setSearchText}
                />
            </View>
            <View style={styles.body}>
                {payments && payments.map((payment) => (
                    (
                        <PaymentCard
                            key={payment._id}
                            payment={payment}
                        />
                    )
                )
                )}
            </View>
            <View>
                <BottomBar bottomData={bottomData} />
            </View>
            <Modal visible={openPaymentModal}>
                <FormLayout headerText={`Оплата`} onClose={() => setOpenPaymentModal(false)} >
                    <PaymentForm />
                </FormLayout>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    body: {
        flex: 1,
        padding: 5,
    },
})
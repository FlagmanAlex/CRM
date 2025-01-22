import React from 'react'
import { Modal, StyleSheet, Text, View } from 'react-native'
import { FormLayout } from '../../shared/FormLayout'
import { Button } from '../../shared/Button'
import { ButtonApply } from '../Buttons/ButtonApply'
import { ButtonDelete } from '../Buttons/ButtonDelete'
import { ButtonBack } from '../Buttons/ButtonBack'
import { TextField } from '../../shared/TextField'

interface OICMProps {
    openModal: boolean
    onClose: () => void
}


export const OrderItemsCardModal = ({ onClose, openModal } : OICMProps) => {

    const handleSave = () => { 
        onClose()
    }
    
    const handleDelete = () => { 
        onClose()
    }

    const handleCancel = () => { 
        onClose()
     }

    return (
        <Modal visible={openModal}>
            <FormLayout headerText={`Карточка товара`} onClose={onClose}>
                <View style={style.content}>
                    <View style={style.bodyBlock}>
                        
                    </View>
                    <View style={style.buttonBlock}>
                        <ButtonApply onPress={handleSave} />
                        <ButtonBack onPress={handleCancel} />
                        <ButtonDelete onPress={handleDelete} />
                    </View>
                </View>
            </FormLayout>
        </Modal>
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
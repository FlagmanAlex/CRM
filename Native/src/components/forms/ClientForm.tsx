import React from 'react'
import { Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { IClient } from '../../../../Interfaces/IClient'
import { STYLE, THEME } from '../../Default'
import { FormLayout } from '../../shared/FormLayout'
import { Button } from '../../shared/Button'
import { AntDesign } from '@expo/vector-icons'
import { ButtonApply } from '../Buttons/ButtonApply'
import { ButtonDelete } from '../Buttons/ButtonDelete'
import { ButtonBack } from '../Buttons/ButtonBack'

interface ClientFormProps {
    client: IClient
    onClose: () => void
    onChange: (field: keyof IClient, value: string | number) => void
    onSave: () => void
    onDelete: () => void
}

export const ClientForm = ({ onChange, client, onClose, onSave, onDelete }: ClientFormProps) => {

    const fields = [
        { key: "name", placeholder: "Имя", value: client.name, keyboardType: "default" as const, multiline: false },
        { key: "gender", placeholder: "Пол", value: client.gender, keyboardType: "default"  as const, multiline: false  },
        { key: "address", placeholder: "Адрес", value: client.address, keyboardType: "default"  as const, multiline: true  },
        { key: "phone", placeholder: "Телефон", value: client.phone, keyboardType: "phone-pad"  as const, multiline: false  },
        { key: "percent", placeholder: "Процент", value: String(client.percent), keyboardType: "numeric"  as const, multiline: false  },
        { key: "GPS", placeholder: "GPS", value: client.gps, keyboardType: "default"  as const, multiline: false  },
    ];

  return (
        <FormLayout headerText={`Клиент ${client.name}`} onClose={onClose}>
            <View style={style.content}>
                {fields.map((field, index) => (
                    <View style={style.panelInput} key={index}>
                        <TextInput 
                            onChangeText={text => onChange(field.key as keyof IClient, text)} 
                            style={style.textInput} 
                            placeholder={field.placeholder}
                            value={field.value}
                            keyboardType={field.keyboardType ? field.keyboardType : "default"}
                            multiline={field.multiline}
                        />
                    </View>
                ))}
            </View>
            <View style={style.buttonBlock}>
                <ButtonApply onPress={onSave} />
                <ButtonDelete onPress={onDelete} />
                <ButtonBack onPress={onClose} />
            </View>
        </FormLayout>
  )
}

const style = StyleSheet.create({
    headerBlock: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        backgroundColor: THEME.color.main
    },
    buttonBlock: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    headerText: {
        color: THEME.color.white,
        fontSize: 20
    },
    content: {
        width: '100%',
        // height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20,
        gap: 10
    },
    image: {
        width: 30,
        height: 30,
    },
    textInput: {
        borderColor: THEME.color.grey,
        // borderStyle: 'solid',
        fontSize: 20,
        borderWidth: 1,
        borderRadius: 10,
        width: '100%',
        paddingHorizontal: 5,
      },
      panelInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: THEME.color.grey,
        shadowOpacity: 1,
        shadowOffset: {
            width: 5,
            height: 5
        },
        shadowRadius: 2

      }
    
})
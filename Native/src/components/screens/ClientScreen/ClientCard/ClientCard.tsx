import React from 'react'
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { IClient } from '../../../../../../Interfaces/IClient'
import { STYLE, THEME } from '../../../../Default'

interface IClientCardProps {
    client: IClient
    select: (client: IClient) => void
}



export const ClientCard = ({ client, select }: IClientCardProps) => {

    const callPhone = async (phoneNumber: string) => {
        
        const supported = await Linking.canOpenURL(phoneNumber);
      
        if (supported) {
          await Linking.openURL(phoneNumber);
        } else {
          Alert.alert('Не удается открыть номер телефона');
        }
      };

    return (
        <TouchableOpacity 
            onPress={() => {if (client._id) select(client)}}
            onLongPress={() => {}}
        >
            <View 
                style={style.card} 
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text numberOfLines={1} style={STYLE.textName}>{client.name}</Text>
                    <Text onPress={() => callPhone(`tel:${client.phone}`)} style={STYLE.textPhone} >{client.phone}</Text>                
                </View>
                <View>
                    <Text>{client.address}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text selectable={true}>GPS: {client.gps}</Text>
                    <Text selectable={true}>Процент: {client.percent}</Text>
                    <Text selectable={true}>Пол: {client.gender}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const style = StyleSheet.create({
    card: {
        width: '100%',
        padding: 15,
        // borderColor: '#ccc',
        borderStyle: 'solid',
        // borderWidth: 1,
        // borderRadius: 5,
        shadowColor: THEME.color.black,
        // shadowOpacity: 20,
        // shadowRadius: 20,
        // shadowOffset: { width: 10, height: 10 },
        elevation: 2,
        marginBottom: 5
    }
})
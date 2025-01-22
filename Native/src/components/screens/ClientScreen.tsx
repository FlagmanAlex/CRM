import React, { useEffect, useState } from 'react'
import { Alert, FlatList, Modal, ScrollView, StyleSheet, View } from 'react-native'
import axios from 'axios'
import { IClient } from '../../../../Interfaces/IClient'
import { ClientCard } from '../ClientCard'
import { ClientForm } from '../forms/ClientForm'
import { TextField } from '../../shared/TextField'
import { SETTINGS } from '../../Default'


export const ClientScreen = () => {

    const [clients, setClients] = useState<IClient[]>([])
    const [selectClient, setSelectClient] = useState<IClient>()
    const [openModal, setOpenModal] = useState(false)
    const [filterClient, setFilterClient] = useState<IClient[]>([])
    const [searchText, setSearchText] = useState('')

    const handleFieldChange = (field: keyof IClient, value: string | number) => {
        setSelectClient(prev => (prev ? {...prev, [field]: value} : undefined))
    }
    
    const handleSaveClient = async () => {
        if (selectClient) {
          try {
            await axios.put(`${server}/api/client/${selectClient._id}`, selectClient)
            setClients((prevClients) => prevClients.map((client) =>
              client._id === selectClient._id ? selectClient : client
            )
          )
          closeClientForm()
          } catch (error) {
            Alert.alert("Ошибка сохранения данных");
            
          }
        }
      }
    
      const handleDeleteClient = async () => {
        if (selectClient) {
          try {
            await axios.delete(`${server}/api/client/${selectClient._id}`);
            setClients((prevClients) =>
              prevClients.filter((client) => client._id !== selectClient._id)
            );
            closeClientForm();
          } catch (error) {
            Alert.alert("Ошибка удаления клиента:");
          }
        }
      };  

    const selectClientHandler = (client: IClient) => {
        setSelectClient(client)
        setOpenModal(true)
    }

    const filterChangeString = (filterString: string) => {
      setSearchText(filterString)
      setFilterClient(
          clients.filter(item => 
            item.name &&
            item.name.toLowerCase().includes(filterString.toLowerCase())
          )
        )
    }

    const closeClientForm = () => {
        setOpenModal(false)
    }
    
    const server = `${SETTINGS.host}:${SETTINGS.port}`

    useEffect( () => {
        const responsDB = async () => {
            try {
                const response = await axios.get(`${server}/api/client`)
                setClients(response.data)
            } catch (error) {
                Alert.alert('Ошибка сервера')
            }
        }

        responsDB()
        setFilterClient(clients)

    },[])

  return (
    <View style={style.content}>
        <TextField
          onChangeText={filterChangeString}
          value={searchText}
          placeholder='Введите имя клиента'
        />
            {clients.length > 0 ? (
            <FlatList 
              data={
                clients.filter((client => 
                client.name && 
                client.name
                  .toLocaleLowerCase()
                  .includes(searchText
                  .toLocaleLowerCase()
                )))
              }
              renderItem={({item}) => <ClientCard client={item} select={selectClientHandler} />}
              keyExtractor={(item, index) => item._id ?? index.toString()}
            />
            ) : null}
            {selectClient ? 
                <Modal 
                  visible={openModal}
                  animationType='none'
                  hardwareAccelerated={true}
                >
                    <ClientForm 
                        onChange={handleFieldChange} 
                        client={selectClient} 
                        onClose={closeClientForm} 
                        onDelete={handleDeleteClient}
                        onSave={handleSaveClient}
                    />
                </Modal>
            : null}
    </View>
  )
}

const style = StyleSheet.create({
  content: {
    flex: 1,
    // width: '100%',
    // height: 'auto',
    // justifyContent: 'center',
    // alignItems: 'center',
    // padding: 1,
  },
  scroll: {
    flex: 1,
    flexDirection: 'column',
  }
})
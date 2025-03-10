import React, { useEffect, useState } from 'react'
import { Alert, FlatList, StyleSheet, View } from 'react-native'
import axios from 'axios'
import { IClient } from '../../../../../Interfaces/IClient'
import { ClientCard } from './ClientCard/ClientCard'
import { ClientForm } from './ClientForm/ClientForm'
import { TextField } from '../../../shared/TextField'
import { host, port } from '../../../Default'
import { useContextData } from '../../../ContextProvider'
import { BottomBar } from '../../BottomBar'

interface IClientScreenProps {
  select?: (clinet: IClient) => void
}



export const ClientScreen = ({ select }: IClientScreenProps) => {

  const server = `${host}:${port}`

  const { clients, setClients } = useContextData()

  const [selectClient, setSelectClient] = useState<IClient>()
  const [openModal, setOpenModal] = useState(false)

  //Фильтрация списка
  const [filterClient, setFilterClient] = useState<IClient[]>([])
  const [searchText, setSearchText] = useState('')

  const handleFieldChange = (field: keyof IClient, value: string | number) => {
    setSelectClient(prev => (prev ? { ...prev, [field]: value } : undefined))
  }

  const handleSaveClient = async () => {
    if (selectClient) {
      try {

        if (!selectClient.name) {
          Alert.alert('Имя клиента не может быть пустым')
          return
        }

        if (selectClient._id) {
          await axios.put(`${server}/api/client/${selectClient._id}`, selectClient)
          setClients((prevClients) =>
            prevClients.map((client) =>
              client._id === selectClient._id ? selectClient : client
            )
          )
        } else {

          const response = await axios.post(`${server}/api/client/`, selectClient)
          const updateClient = response.data

          const updateClients = { ...clients, ...updateClient }

          setClients(updateClients)
        }
        closeClientForm()
      } catch (error) {
        Alert.alert("Ошибка сохранения данных");

      }
    }
  }

  const handleOpenNewClientForm = () => {
    const newClient: IClient = {
      address: '',
      gender: '',
      gps: '',
      name: '',
      percent: 15,
      phone: ''
    }
    setSelectClient(newClient)
    setOpenModal(true)
  }

  const handleDeleteClient = async () => {
    if (selectClient?._id === '67c9bab271286cadd77e7691') {
      Alert.alert('Данного клиента удалить нельзя')
      return
    }
    Alert.alert('Предупреждение', 'Вы действительно хотите удалить этого клиента?', [
      {
        text: 'Удалить', onPress: async () => {
          if (selectClient) {
            try {
              const response = await axios.get(`${server}/api/order/getOrderByClientId/${selectClient._id}`)
              if (response.data.length > 0) {
                Alert.alert('Не возможно удалить клиента!!!', `Данный клиент используется в ${response.data.length}  операциях`)
                return
              }
              await axios.delete(`${server}/api/client/${selectClient._id}`);
              setClients((prevClients) =>
                prevClients.filter((client) => client._id !== selectClient._id)
              );
              closeClientForm();
            } catch (error) {
              Alert.alert("Ошибка удаления клиента:");
            }
          }
        }
      },
      { text: 'Отмена' }

    ],)
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

   useEffect(() => {
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

  }, [clients])

  return (
    <View style={style.content}>
      <View style={{ paddingVertical: 5 }}>
        <TextField
          onChangeText={filterChangeString}
          value={searchText}
          placeholder='Введите имя клиента'
        />
      </View>
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
          renderItem={({ item }) => (!select ?
            <ClientCard client={item} select={selectClientHandler} /> :
            <ClientCard client={item} select={select} />
          )}
          keyExtractor={(item, index) => item._id ?? index.toString()}
        />
      ) : null}
      <BottomBar bottomData={[{ icons: 'add', action: () => handleOpenNewClientForm() }]} />
      {selectClient ?
        <ClientForm
          openModal={openModal}
          onChange={handleFieldChange}
          client={selectClient}
          onClose={closeClientForm}
          onDelete={handleDeleteClient}
          onSave={handleSaveClient}
        />
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
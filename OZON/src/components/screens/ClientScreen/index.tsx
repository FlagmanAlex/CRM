import React, { useEffect, useMemo, useState } from 'react'
import { Alert, FlatList, Image, StyleSheet, View } from 'react-native'
import { IClient } from '../../../../../Interfaces/IClient'
import { ClientCard } from './ClientCard'
import { ClientForm } from './ClientForm'
import { BottomBar } from '../../BottomBar'
import { useSelector } from 'react-redux'
import { addClient, deleteClient, fetchClient, selectAllClients, updateClient } from '../../../store/clientSlice'
import { useDispatch } from '../../../hooks/useStore'
import { SerachBar } from '../../SerachBar'

interface IClientScreenProps {
  select?: (clinet: IClient) => void
}


export const ClientScreen = ({ select }: IClientScreenProps) => {
  const dispatch = useDispatch()

  const clients = useSelector(selectAllClients)

  const [openModal, setOpenModal] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectClient, setSelectClient] = useState<IClient>()

  const filteredClients = useMemo(() => {
    return clients.filter((client) =>
      client.name &&
      client.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [clients, searchText]);


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
          dispatch(updateClient(selectClient))
        } else {
          dispatch(addClient(selectClient))
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
    if (selectClient?._id) {
      if (selectClient.name === '<Клиент не выбран>') {
        Alert.alert('Данного клиента удалить нельзя')
        return
      }
      Alert.alert('Предупреждение', 'Вы действительно хотите удалить этого клиента?', [
        {
          text: 'Удалить', onPress: async () => {
            const resp = (await dispatch(deleteClient(selectClient._id!))).payload
            if (resp !== selectClient._id) Alert.alert('Предупреждение!!!', resp ? resp.toString() : '')
            else closeClientForm()
          }
        },
        { text: 'Отмена' }

      ],)
    }
  };

  const selectClientHandler = (client: IClient) => {
    setSelectClient(client)
    setOpenModal(true)
  }

  const closeClientForm = () => {
    setOpenModal(false)
  }

  useEffect(() => {
    const responsDB = async () => {
      dispatch(fetchClient())
    }
    responsDB()
  }, [dispatch])

  return (
    <View style={style.content}>
      <SerachBar
        placeholder='Введите имя клиента'
        searchText={searchText}
        setSearchText={setSearchText}
      />
      <View style={{ flex: 1, height: '100%' }}>
        {filteredClients.length > 0 ? (
          <FlatList
            data={filteredClients}
            renderItem={({ item }) => (<ClientCard client={item} select={select ? select : selectClientHandler} />)}
            keyExtractor={(item) => item._id ?? item.name ?? Math.random().toString()}
            ListEmptyComponent={(
              <View style={style.image}>
                <Image source={require('../../../../assets/NoItems.png')} />
              </View>
            )}
          />
        ) : null}
      </View>
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
    height: '100%',
    // justifyContent: 'center',
    // alignItems: 'center',
    // padding: 1,
  },
  scroll: {
    // flex: 1,
    flexDirection: 'column',
  },
  image: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

})
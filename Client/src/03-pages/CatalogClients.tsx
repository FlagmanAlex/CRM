import axios from "axios"
import React, { useEffect, useState } from "react"
import { IClient } from '../../../Interfaces/IClient'

const host = import.meta.env.VITE_BACKEND_HOST
const port = import.meta.env.VITE_BACKEND_PORT
const server = `${host}:${port}`

export const CatalogClients = () => {

  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [clients, setClients] = useState<IClient[]>([])
  const [selectedClient, setSelectedClient] = useState<IClient | null>(null)

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedClient(null)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setOpenDialog(false); // Закрытие окна (обновление состояния)
    }
  };

  const handleFieldChange = (field: keyof IClient, value: string) => {
    setSelectedClient(prev => (prev ? {...prev, [field]: value} : null))
  }

  const handleSaveClient = async () => {
    if (selectedClient) {
      try {
        await axios.put(`${host}:${port}/api/client/${selectedClient._id}`, selectedClient)
        setClients((prevClients) => prevClients.map((client) =>
          client._id === selectedClient._id ? selectedClient : client
        )
      )
      handleCloseDialog()
      } catch (error) {
        console.error("Ошибка сохранения данных", error);
        
      }
    }
  }

  const handleDeleteClient = async () => {
    if (selectedClient) {
      try {
        await axios.delete(`${host}:${port}/api/client/${selectedClient._id}`);
        setClients((prevClients) =>
          prevClients.filter((client) => client._id !== selectedClient._id)
        );
        handleCloseDialog();
      } catch (error) {
        console.error("Ошибка удаления клиента:", error);
      }
    }
  };  

  useEffect(() => {
    const requestDb = async () => {
      try {
        const response = await axios.get(`${server}/api/client`)
        setClients(response.data)
      } catch (error) {
        console.log(error);
        
      }
    }

    requestDb()

  },[])

  return (
    <div 
      className="w-full pt-10 text-ellipsis box-border"
      >
      {
        clients.map((client) => (
          <div 
            onClick={() => {
              setSelectedClient(client)
              setOpenDialog(true)
            }}
            key={client._id} 
            className="p-3
              bg-stone-100 m-2 rounded-lg
              drop-shadow-md hover:bg-stone-50 grid grid-cols-6 "
          >
            {/* <div className="flex flex-row gap-3 justify-between"> */}
              <strong className="col-start-1 col-span-4">{client.name}</strong>
              <a 
                href={`tel:${client.phone}`} 
                className="col-start-5 col-span-2 text-right overflow-clip "
                onClick={(e) => e.stopPropagation()}
              >
                {client.phone}
              </a>
            {/* </div> */}
            {/* <div className="flex flex-row gap-3 justify-between"> */}
              <span className="text-stone-700 text-xs col-start-1 col-span-3">{client.address}</span>
              <span className="text-stone-700 text-xs text-center col-span-1">{client.percent}%</span>
              <span className="text-stone-700 text-xs text-right col-span-2">{client.gps}</span>
            {/* </div> */}
          </div>
        ))
      }

      {/* Диалоговое окно */}
      {openDialog && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          aria-labelledby="dialog"
        >
          {/* Фон затемнения */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            // onClick={handleCloseDialog} // Закрытие по клику на фон
            onKeyDown={handleKeyDown}
          ></div>

          {/* Содержимое диалога */}
          <div
            className="relative bg-white p-6 rounded-md shadow-lg z-10 max-w-md w-full"
            onClick={(e) => e.stopPropagation()} // Предотвращаем всплытие события
          >
            <h2 className="text-lg font-bold mb-4">Диалоговое окно</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Имя"
                className="w-full border px-3 py-2 rounded-md"
                value={selectedClient?.name}
                onChange={e => handleFieldChange("name", e.target.value)}
              />
              <input
                type="text"
                placeholder="Адрес доставки"
                className="w-full border px-3 py-2 rounded-md"
                value={selectedClient?.address}
                onChange={e => handleFieldChange("address", e.target.value)}
              />
              <input
                type="text"
                placeholder="Телефон"
                className="w-full border px-3 py-2 rounded-md"
                value={selectedClient?.phone}
                onChange={e => handleFieldChange("phone", e.target.value)}
              />
              <input
                type="text"
                placeholder="Пол"
                className="w-full border px-3 py-2 rounded-md"
                value={selectedClient?.gender}
                onChange={e => handleFieldChange("gender", e.target.value)}
              />
              <input
                type="text"
                placeholder="Процент"
                className="w-full border px-3 py-2 rounded-md"
                value={selectedClient?.percent}
                onChange={e => handleFieldChange("percent", e.target.value)}
              />
              <input
                type="text"
                placeholder="GPS"
                className="w-full border px-3 py-2 rounded-md"
                value={selectedClient?.gps}
                onChange={e => handleFieldChange("gps", e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  className="w-full bg-green-500 text-white py-2 rounded-md"
                  autoFocus
                  onClick={
                    handleSaveClient
                  }
                >Сохранить</button>
                <button
                  className="w-full bg-red-500 text-white py-2 rounded-md"
                  onClick={
                    handleDeleteClient
                  }
                >Удалить</button>
                <button
                  className="w-full bg-blue-500 text-white py-2 rounded-md"
                  onClick={
                    handleCloseDialog
                  }
                >Отменить</button>
              </div>
            </div>
            <button
              className="absolute top-2 right-2 
              text-gray-500 hover:text-gray-700"
              onClick={handleCloseDialog}
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

import React, { createContext, ReactNode, useContext, useState } from 'react'
import { IOrderList } from '../../Interfaces/IOrderList'
import { IOrderItem } from '../../Interfaces/IOrderItem'
import { IClient } from '../../Interfaces/IClient'

type ContextType = {
    clients: IClient[]
    setClients: React.Dispatch<React.SetStateAction<IClient[]>>
    orderLists: IOrderList[]
    setOrderLists: React.Dispatch<React.SetStateAction<IOrderList[]>>
    orderItems: IOrderItem[]
    setOrderItems: React.Dispatch<React.SetStateAction<IOrderItem[]>>
}

const contextData = createContext<ContextType | undefined>(undefined)

interface ContextProviderProps {
    children: ReactNode
}

export const ContextProvider = ({ children }: ContextProviderProps) => {
    const [orderLists, setOrderLists] = useState<IOrderList[]>([])
    const [orderItems, setOrderItems] = useState<IOrderItem[]>([])
    const [clients, setClients] = useState<IClient[]>([])

    return (
        <contextData.Provider value={{clients, setClients, orderLists, setOrderLists, orderItems, setOrderItems }}>
            {children}
        </contextData.Provider>
    )
}

export const useContextData = () => {
    const context = useContext(contextData)
    if (!context) {
        throw new Error('useContextData отсутствует в ContextProvider')
    }
    return context
}
import React, { createContext, ReactNode, useContext, useState } from 'react'
import { IOrderList } from '../../Interfaces/IOrderList'
import { IOrderItem } from '../../Interfaces/IOrderItem'

type ContextType = {
    orders: IOrderList[]
    setOrders: React.Dispatch<React.SetStateAction<IOrderList[]>>
    orderItems: IOrderItem[]
    setOrderItems: React.Dispatch<React.SetStateAction<IOrderItem[]>>
}

const contextData = createContext<ContextType | undefined>(undefined)

interface ContextProviderProps {
    children: ReactNode
}

export const ContextProvider = ({ children }: ContextProviderProps) => {
    const [orders, setOrders] = useState<IOrderList[]>([])
    const [orderItems, setOrderItems] = useState<IOrderItem[]>([])

    return (
        <contextData.Provider value={{ orders, setOrders, orderItems, setOrderItems }}>
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
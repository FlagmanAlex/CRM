import React, { useEffect, useState } from "react"
import axios from 'axios'

const host = import.meta.env.VITE_BACKEND_HOST
const port = import.meta.env.VITE_BACKEND_PORT
const server = `${host}:${port}`

interface IOrderFace {
  _id: string
  date: string
  clientName: string
  discountSum: number
  priceSum: number
  percent: number
}

export const Journal = () => {

    const [orders, setOrders] = useState<IOrderFace[]>([])
    const [selectedOrders, setSelectedOrders] = useState('')

    useEffect(() => {
        const requestDb = async () => {
          try {
            const response = await axios.get(`${server}/api/order`)
            setOrders(response.data)
          } catch (error) {
            console.log(error);
            
          }
        }
    
        requestDb()
    
      },[])
    
      const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const orderId = e.currentTarget.dataset.orderId
        console.log(orderId);
        setSelectedOrders(orderId || '')
      }



    return (
      <div className="">
          <div aria-label='filter' className="bg-ston-600 h-12 w-full">

          </div>
          <div aria-label='ListBox' className='flex flex-col gap-1 p-2'>
            {orders.map(item => 
              (
                <div 
                  aria-label='Row' 
                  data-order-id={item._id} 
                  className="grid grid-cols-3 p-2 rounded-xl bg-slate-200
                  hover:bg-slate-100 active:bg-slate-300 cursor-pointer"
                  onClick={handleClick}
                >
                  <span className=''>Дата: {item.date}</span>
                  <div className='col-span-2 pl-2'><strong>{item.clientName}</strong></div>
                  {/* <div className=''>Сумма со скидкой: {item.discountSum}</div> */}
                  <div className=''>Заказ: {item.priceSum}</div>
                  <div className=''>Доставка: {Math.round(item.percent/100*item.priceSum)}</div>
                  <div className='text-end'>Итого: <strong>{Math.round((item.percent/100+1)*item.priceSum)}</strong></div>
                </div>
              )
            )}
          </div>
      </div>
    )
}

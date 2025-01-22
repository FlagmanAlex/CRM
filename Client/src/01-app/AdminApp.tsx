import React from 'react'
//import s from './AdminApp.module.css'
import { NavBar } from '../04-widgets/NavBar/NavBar'
import { Router } from './Router'

interface INavText {
  navigate?: string
  text: string
  subItems: {navigate: string, text: string}[]
}


export const AdminApp:React.FC = () => {

  const navDataLine: INavText[]  = [
    {
      text: 'Магазин',
      subItems: [
        {text: 'Витамины', navigate: 'mvok/cards/vitamins'},
        {text: 'Парфюмерия', navigate: 'mvok/cards/parfums'}
      ], 
    },
    {
      text: 'Каталог',
      subItems: [
        {text: 'Клиенты', navigate: 'ozon/catalog/clients'}
      ],
    },
    {
      text: 'Новая карточка', 
      subItems: [],
      navigate: '/newProduct'},
    {
      text: 'Парфюм', 
      subItems: [],
      navigate: '/mvok/cards/parfum'
    },
    {
      text: 'Журнал', 
      subItems: [],
      navigate: '/journal'
    },
  ];



  return (
    <>
        <NavBar data={navDataLine}/>
        <Router />
    </>
  )
}

import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { FormVitamin } from '../04-widgets/FormVitamin'
import { CardsParfum } from '../03-pages/CardsParfum'
//import { ParfumCardEdit } from '../../../03-pages/ParfumCardsEdit'
import { DocumentsPage } from '../03-pages/DocumentPage/UI/DocumentsPage'
import { VitaminCards } from '../03-pages/VitaminCards/UI/VitaminCards'
import { NewProduct } from '../03-pages/NewProduct'
import { FormParfum } from '../04-widgets/FormParfum'
import { HomePageBrowser } from '../03-pages/HomePageBrowser'
import { CatalogClients } from '../03-pages/CatalogClients'

export const Router:React.FC = () => {
  return (
    <Routes>
        <Route path='/' element={<Navigate to={'/home'}/>}/>
        <Route path='/mvok/cards/parfums' Component={CardsParfum} />
        <Route path='/mvok/cards/vitamins' Component={VitaminCards} />
        <Route path='/vitamin' Component={FormVitamin}/>
        <Route path='/parfum/edit' Component={FormParfum} />
        <Route path='/newProduct' element={<NewProduct />} />
        <Route path='/documents' element={<DocumentsPage />} />
        <Route path='/home' element={<HomePageBrowser />} />
        <Route path='/ozon/catalog/clients' element={<CatalogClients/>} />
    </Routes>
  )
}

import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { FormVitamin } from '../../../04-widgets/FormVitamin'
import { ParfumCards } from '../../../03-pages/ParfumCards'
import { ParfumCardEdit } from '../../../03-pages/ParfumCardsEdit'
import { DocumentsPage } from '../../../03-pages/DocumentPage/UI/DocumentsPage'
import { VitaminCards } from '../../../03-pages/VitaminCards/UI/VitaminCards'
import { NewProduct } from '../../../03-pages/NewProduct'
import { FormParfum } from '../../../04-widgets/FormParfum'
import { HomePageBrowser } from '../../../03-pages/HomePageBrowser'

export const Router = () => {
  return (
    <Routes>
        <Route path='/' element={<Navigate to={'/home'}/>}/>
        <Route path='/catalog/parfums' Component={ParfumCards} />
        <Route path='/catalog/vitamins' Component={VitaminCards} />
        <Route path='/vitamin' Component={FormVitamin}/>
        <Route path='/parfum' Component={ParfumCards} />
        <Route path='/parfum/edit' Component={FormParfum} />
        <Route path='/newProduct' element={<NewProduct />} />
        <Route path='/documents' element={<DocumentsPage />} />
        <Route path='/home' element={<HomePageBrowser />} />
    </Routes>
  )
}

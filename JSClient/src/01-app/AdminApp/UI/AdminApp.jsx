import React from 'react'
import s from './AdminApp.module.css'
import { NavBar } from '../../../04-widgets/NavBar'
import { Router } from '../../Routers'

export const AdminApp = () => {
  return (
    <>
        <NavBar />
        <Router />
    </>
  )
}

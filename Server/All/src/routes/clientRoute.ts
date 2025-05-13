import express from 'express'
import { createClient, deleteClient, getClient, getClients, updateClient } from '../controllers/clientController'

export const clientRoute = express.Router()


clientRoute.get('/', getClients)
clientRoute.post('/', createClient)
clientRoute.get('/:id', getClient)
clientRoute.put('/:id', updateClient)
clientRoute.delete('/:id', deleteClient)
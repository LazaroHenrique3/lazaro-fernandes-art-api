import express from 'express'
import 'dotenv/config'
import cors from 'cors'

import path from 'path'

import './shared/services/TranslationsYup'
import { router } from './routes'

const server = express()

server.use('/files', express.static(path.resolve(__dirname, './images' )))

server.use(cors({
    origin: process.env.ENABLED_CORS?.split(';') || []
}))

//Configurando o server
server.use(express.json())
server.use(router)

export { server }
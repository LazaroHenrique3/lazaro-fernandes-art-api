import express from 'express'

const server = express()

//Configurando o server
server.get('/', (_, res) => res.send('Hello, world!'))

export { server }
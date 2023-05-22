import supertest from 'supertest'
import { server } from '../src/server/Server'
import { Knex } from '../src/server/database/knex'

//Como está usando o banco em memória eu preciso rodar as migrations antes
beforeAll(async () => {
    await Knex.migrate.latest()
})

//Fecha as conexões após os testes
afterAll(async () => {
    await Knex.destroy()
})

//Retorna como se fosse uma instância do nosso server
export const testServer = supertest(server)
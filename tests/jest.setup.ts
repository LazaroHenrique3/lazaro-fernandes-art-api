import supertest from 'supertest'
import { server } from '../src/server/Server'

//Retorna como se fosse uma instância do nosso server
export const testServer = supertest(server)
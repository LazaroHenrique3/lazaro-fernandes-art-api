import { StatusCodes } from 'http-status-codes'
import { testServer } from '../jest.setup'

describe('Technique - Create', () => {

    let accessToken = ''

    //Adicionando a autenticação
    beforeAll(async () => {
        //Logando no admin gerado pela seed
        const adminSeed = await testServer.post('/adminsignin').send({ email: 'admin@gmail.com', password: 'secret1' })

        accessToken = adminSeed.body.accessToken
    })

    it('Create register no token', async () => {

        const res1 = await testServer
            .post('/technique')
            .send({ name: 'Rock' })

        expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
        expect(res1.body).toHaveProperty('errors.default')
    })

    it('Create register', async () => {

        const res1 = await testServer
            .post('/technique')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send({ name: 'Rock' })

        expect(res1.statusCode).toEqual(StatusCodes.CREATED)
        expect(typeof res1.body).toEqual('number')
    })

    it('Create register with name less than 3', async () => {

        const res1 = await testServer
            .post('/technique')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send({ name: 'Ro' })

        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST)
        expect(res1.body).toHaveProperty('errors.body.name')
    })

    it('Create register with name greater than 100', async () => {

        const res1 = await testServer
            .post('/technique')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send({ name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dictum lectus vitae ipsum pharetra, in pulvinar orci volutpat dictum lectus.' })

        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST)
        expect(res1.body).toHaveProperty('errors.body.name')
    })
})
import { StatusCodes } from 'http-status-codes'
import { testServer } from '../jest.setup'

describe('Category - GetAll', () => {

    let accessToken = ''

    //Adicionando a autenticação
    beforeAll(async () => {
        //Logando no admin gerado pela seed
        const adminSeed = await testServer.post('/adminsignin').send({ email: 'admin@gmail.com', password: 'secret1' })

        accessToken = adminSeed.body.accessToken
    })

    it('Get all registers not token', async () => {

        const res1 = await testServer
            .post('/category')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send({ name: 'JestTeste1' })

        expect(res1.statusCode).toEqual(StatusCodes.CREATED)

        const resGet = await testServer
            .get('/category')
            .send()

        expect(resGet.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
        expect(resGet.body).toHaveProperty('errors.default')
    })

    it('Get all registers', async () => {

        const res1 = await testServer
            .post('/category')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send({ name: 'JestTeste2' })

        expect(res1.statusCode).toEqual(StatusCodes.CREATED)

        const resGet = await testServer
            .get('/category')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send()

        expect(Number(resGet.header['x-total-count'])).toBeGreaterThan(0)
        expect(resGet.statusCode).toEqual(StatusCodes.OK)
        expect(resGet.body.length).toBeGreaterThan(0)
    })
})
import { StatusCodes } from 'http-status-codes'
import { testServer } from '../jest.setup'

describe('Category - GetById', () => {

    let accessToken = ''

    //Adicionando a autenticação
    beforeAll(async () => {
        //Logando no admin gerado pela seed
        const adminSeed = await testServer.post('/adminsignin').send({ email: 'admin@gmail.com', password: 'secret1' })

        accessToken = adminSeed.body.accessToken
    })

    it('Get by id registers not token', async () => {

        const res1 = await testServer
            .post('/category')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send({ name: 'JestTeste1' })

        expect(res1.statusCode).toEqual(StatusCodes.CREATED)

        const resGet = await testServer
            .get(`/category/${res1.body}`)
            .send()

        expect(resGet.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
        expect(resGet.body).toHaveProperty('errors.default')
    })

    it('Get by id registers', async () => {

        const res1 = await testServer
            .post('/category')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send({ name: 'JestTeste2' })

        expect(res1.statusCode).toEqual(StatusCodes.CREATED)

        const resGet = await testServer
            .get(`/category/${res1.body}`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send()

        expect(resGet.statusCode).toEqual(StatusCodes.OK)
        expect(resGet.body).toHaveProperty('name')
    })

    it('Get non-existent register', async () => {

        const res1 = await testServer
            .get('/category/999999')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send()

        expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
        expect(res1.body).toHaveProperty('errors.default')
    })
})
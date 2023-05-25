import { StatusCodes } from 'http-status-codes'
import { testServer } from '../jest.setup'

describe('Category - DeleteById', () => {

    let accessToken = ''

    //Adicionando a autenticação
    beforeAll(async () => {
        //Logando no admin gerado pela seed
        const adminSeed = await testServer.post('/adminsignin').send({ email: 'admin@gmail.com', password: 'secret1' })

        accessToken = adminSeed.body.accessToken
    })


    it('Delete register not token', async () => {

        const res1 = await testServer
            .post('/category')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send({ name: 'JestTeste1' })

        expect(res1.statusCode).toEqual(StatusCodes.CREATED)

        const resDeleted = await testServer
            .delete(`/category/${res1.body}`)
            .send()

        expect(resDeleted.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
        expect(resDeleted.body).toHaveProperty('errors.default')
    })


    it('Delete register', async () => {

        const res1 = await testServer
            .post('/category')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send({ name: 'JestTeste2' })

        expect(res1.statusCode).toEqual(StatusCodes.CREATED)

        const resDeleted = await testServer
            .delete(`/category/${res1.body}`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send()

        expect(resDeleted.statusCode).toEqual(StatusCodes.NO_CONTENT)
    })

    it('Deleting non-existent register', async () => {

        const res1 = await testServer
            .delete('/category/999999')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send()

        expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
        expect(res1.body).toHaveProperty('errors.default')
    })
})
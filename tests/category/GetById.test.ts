import { StatusCodes } from 'http-status-codes'
import { testServer } from '../jest.setup'

describe('Category - GetById', () => {

    it('Get all registers', async () => {

        const res1 = await testServer
            .post('/category')
            .send({ name: 'JestTeste'})
        
        expect(res1.statusCode).toEqual(StatusCodes.CREATED)

        const resGet = await testServer
            .get(`/category/${res1.body}`)
            .send()

        expect(resGet.statusCode).toEqual(StatusCodes.OK)
        expect(resGet.body).toHaveProperty('name')
    })

    it('Get non-existent register', async () => {

        const res1 = await testServer
            .get('/category/999999')
            .send()

        expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
        expect(res1.body).toHaveProperty('errors.default')
    })
})
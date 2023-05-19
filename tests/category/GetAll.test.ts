import { StatusCodes } from 'http-status-codes'
import { testServer } from '../jest.setup'

describe('Category - GetAll', () => {

    it('Get all registers', async () => {

        const res1 = await testServer
            .post('/category')
            .send({ name: 'JestTeste'})
        
        expect(res1.statusCode).toEqual(StatusCodes.CREATED)

        const resGet = await testServer
            .get('/category')
            .send()

        expect(Number(resGet.header['x-total-count'])).toBeGreaterThan(0)
        expect(resGet.statusCode).toEqual(StatusCodes.OK)
        expect(resGet.body.length).toBeGreaterThan(0)
    })
})
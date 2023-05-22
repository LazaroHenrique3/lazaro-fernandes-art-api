import { StatusCodes } from 'http-status-codes'
import { testServer } from '../jest.setup'

describe('Technique - GetAll', () => {

    it('Get all registers', async () => {

        const res1 = await testServer
            .post('/technique')
            .send({ name: 'JestTeste'})
        
        expect(res1.statusCode).toEqual(StatusCodes.CREATED)

        const resGet = await testServer
            .get('/technique')
            .send()

        expect(Number(resGet.header['x-total-count'])).toBeGreaterThan(0)
        expect(resGet.statusCode).toEqual(StatusCodes.OK)
        expect(resGet.body.length).toBeGreaterThan(0)
    })
})
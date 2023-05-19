import { StatusCodes } from 'http-status-codes'
import { testServer } from '../jest.setup'

describe('Category - Create', () => {

    it('Create register', async () => {

        const res1 = await testServer
            .post('/category')
            .send({ name: 'Rock'})
        
        expect(res1.statusCode).toEqual(StatusCodes.CREATED)
        expect(typeof res1.body).toEqual('number')
    })

    it('Create register with name less than 3', async () => {

        const res1 = await testServer
            .post('/category')
            .send({ name: 'Ro'})
        
        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST)
        expect(res1.body).toHaveProperty('errors.body.name')
    })
})
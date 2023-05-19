import { StatusCodes } from 'http-status-codes'
import { testServer } from '../jest.setup'

describe('Category - UpdateById', () => {

    it('Update register', async () => {

        const res1 = await testServer
            .post('/category')
            .send({ name: 'JestTeste'})
        
        expect(res1.statusCode).toEqual(StatusCodes.CREATED)

        const resUpdated = await testServer
            .put(`/category/${res1.body}`)
            .send({ name: 'Teste' })

        expect(resUpdated.statusCode).toEqual(StatusCodes.NO_CONTENT)
    })

    it('Updating non-existent register', async () => {

        const res1 = await testServer
            .put('/category/999999')
            .send({name: 'Teste'})

        expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
        expect(res1.body).toHaveProperty('errors.default')
    })
})
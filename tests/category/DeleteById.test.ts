import { StatusCodes } from 'http-status-codes'
import { testServer } from '../jest.setup'

describe('Category - DeleteById', () => {

    it('Delete register', async () => {

        const res1 = await testServer
            .post('/category')
            .send({ name: 'JestTeste'})
        
        expect(res1.statusCode).toEqual(StatusCodes.CREATED)

        const resDeleted = await testServer
            .delete(`/category/${res1.body}`)
            .send()

        expect(resDeleted.statusCode).toEqual(StatusCodes.NO_CONTENT)
    })

    it('Deleting non-existent register', async () => {

        const res1 = await testServer
            .delete('/category/999999')
            .send()
        
        expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
        expect(res1.body).toHaveProperty('errors.default')
    })
})
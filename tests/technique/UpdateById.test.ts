import { StatusCodes } from 'http-status-codes'
import { testServer } from '../jest.setup'

describe('Technique - UpdateById', () => {

    it('Update register', async () => {

        const res1 = await testServer
            .post('/technique')
            .send({ name: 'JestTeste'})
        
        expect(res1.statusCode).toEqual(StatusCodes.CREATED)

        const resUpdated = await testServer
            .put(`/technique/${res1.body}`)
            .send({ name: 'Teste' })

        expect(resUpdated.statusCode).toEqual(StatusCodes.NO_CONTENT)
    })

    it('Updating non-existent register', async () => {

        const res1 = await testServer
            .put('/technique/999999')
            .send({name: 'Teste'})

        expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
        expect(res1.body).toHaveProperty('errors.default')
    })

    it('Update register with name less than 3', async () => {

        const res1 = await testServer
            .post('/technique')
            .send({ name: 'Ro'})
        
        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST)
        expect(res1.body).toHaveProperty('errors.body.name')
    })

    it('Update register with name greater than 100', async () => {

        const res1 = await testServer
            .post('/technique')
            .send({ name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dictum lectus vitae ipsum pharetra, in pulvinar orci volutpat dictum lectus.'})
        
        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST)
        expect(res1.body).toHaveProperty('errors.body.name')
    })
})
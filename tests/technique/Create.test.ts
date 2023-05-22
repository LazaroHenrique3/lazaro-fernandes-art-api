import { StatusCodes } from 'http-status-codes'
import { testServer } from '../jest.setup'

describe('Technique - Create', () => {

    it('Create register', async () => {

        const res1 = await testServer
            .post('/technique')
            .send({ name: 'Rock'})
        
        expect(res1.statusCode).toEqual(StatusCodes.CREATED)
        expect(typeof res1.body).toEqual('number')
    })

    it('Create register with name less than 3', async () => {

        const res1 = await testServer
            .post('/technique')
            .send({ name: 'Ro'})
        
        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST)
        expect(res1.body).toHaveProperty('errors.body.name')
    })

    it('Create register with name greater than 100', async () => {

        const res1 = await testServer
            .post('/technique')
            .send({ name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dictum lectus vitae ipsum pharetra, in pulvinar orci volutpat dictum lectus.'})
        
        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST)
        expect(res1.body).toHaveProperty('errors.body.name')
    })
})
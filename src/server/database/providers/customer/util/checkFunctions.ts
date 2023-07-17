import { ETableNames } from '../../../ETablesNames'
import { Knex } from '../../../knex'
import { Knex as knex } from 'knex'

import { getTokenAndExpiration } from './crudFunctions' 

export const checkValidCustomerId = async (idCustomer: number): Promise<boolean> => {

    const productResult = await Knex(ETableNames.customer)
        .select('id')
        .where('id', '=', idCustomer)
        .first()

    return productResult !== undefined
}

export const checkValidEmail = async (email: string, type: 'insert' | 'update', idCustomer?: number): Promise<boolean> => {

    let customerResult

    if (type === 'insert') {
        customerResult = await Knex(ETableNames.customer)
            .where('email', email)
            .first()
    } else if (type === 'update') {
        customerResult = await Knex(ETableNames.customer)
            .where('email', email)
            .andWhereNot('id', idCustomer)
            .first()
    }


    return customerResult !== undefined
}

export const checkValidCpf = async (cpf: string, type: 'insert' | 'update', idCustomer?: number): Promise<boolean> => {

    let customerResult

    if (type === 'insert') {
        customerResult = await Knex(ETableNames.customer)
            .where('cpf', cpf)
            .first()
    } else if (type === 'update') {
        customerResult = await Knex(ETableNames.customer)
            .where('cpf', cpf)
            .andWhereNot('id', idCustomer)
            .first()
    }

    return customerResult !== undefined
}

export const checkValidCellphone = async (cellphone: string, type: 'insert' | 'update', idCustomer?: number): Promise<boolean> => {

    let customerResult

    if (type === 'insert') {
        customerResult = await Knex(ETableNames.customer)
            .where('cell_phone', cellphone)
            .first()
    } else if (type === 'update') {
        customerResult = await Knex(ETableNames.customer)
            .where('cell_phone', cellphone)
            .andWhereNot('id', idCustomer)
            .first()
    }

    return customerResult !== undefined

}

export const checkAndReturnNameOfCustomerImage = async (idCustomer: number, trx?: knex.Transaction): Promise<string | undefined> => {

    if (trx) {
        const result = await trx(ETableNames.customer).select('image')
            .where('id', '=', idCustomer)
            .first()

        return result?.image
    } else {
        const result = await Knex(ETableNames.customer).select('image')
            .where('id', '=', idCustomer)
            .first()

        return result?.image
    }

}

export const checkValidToken = async (email: string): Promise<string | Error> => {

    //Buscando o token e o tempo de expiração
    const token = await getTokenAndExpiration(email)

    if (token.verification_token_expiration !== null && token.verification_token_expiration !== undefined) {
        const now = new Date()

        if (token.verification_token_expiration < now) {
            return new Error('Token de verificação expirado!')
        }

        return token.verification_token

    } else {
        return new Error('Houve um erro inesperado, tente novamente!')
    }

}
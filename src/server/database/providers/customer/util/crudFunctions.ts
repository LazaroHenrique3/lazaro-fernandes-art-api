import { ETableNames } from '../../../ETablesNames'
import { ICustomer, ICustomerUpdate, ICustomerRedefinePassword, IImageObject } from '../../../models'
import { Knex } from '../../../knex'
import { Knex as knex } from 'knex'

import path from 'path'

import { PasswordCrypto } from '../../../../shared/services'
import { UploadImages } from '../../../../shared/services/UploadImagesServices'

export const getCustomerByEmail = async (email: string): Promise<ICustomer | undefined> => {

    return await Knex(ETableNames.customer)
        .select('*').where('email', '=', email)
        .andWhere('status', '<>', 'Inativo')
        .first()

}

export const getCustomerById = async (idCustomer: number): Promise<Omit<ICustomer, 'password'> | undefined> => {

    return await Knex(ETableNames.customer)
        .select('id', 'status', 'image', 'name', 'email', 'cell_phone', 'genre', 'date_of_birth', 'cpf')
        .where('id', '=', idCustomer)
        .first()

}

export const getCustomersWithFilter = async (filter: string, page: number, limit: number, id: number): Promise<Omit<ICustomer, 'password'>[]> => {

    return await Knex(ETableNames.customer)
        .select('id', 'status', 'image', 'name', 'email', 'cell_phone', 'genre', 'date_of_birth', 'cpf')
        .where('id', Number(id))
        .orWhere('name', 'like', `%${filter}%`)
        .offset((page - 1) * limit)
        .limit(limit)

}

export const getTotalOfRegisters = async (filter: string): Promise<number | undefined> => {

    const [{ count }] = await Knex(ETableNames.customer)
        .where('name', 'like', `%${filter}%`)
        .count<[{ count: number }]>('* as count')

    return count

}

export const getAllAdminsitratorsForReport = async (filter: string): Promise<Omit<ICustomer, 'image' | 'password'>[]> => {

    return Knex(ETableNames.customer)
        .select('id', 'status', 'name', 'email', 'cell_phone', 'genre', 'date_of_birth', 'cpf')
        .where('name', 'like', `%${filter}%`)

}

export const getTokenAndExpiration = async (email: string): Promise<Omit<ICustomerRedefinePassword, 'email' | 'password' | 'confirmPassword'>> => {

    const result = await Knex(ETableNames.customer)
        .select('verification_token', 'verification_token_expiration')
        .where('email', '=', email)
        .first()

    return result as Omit<ICustomerRedefinePassword, 'email' | 'password' | 'confirmPassword'>
}

export const insertNewCustomerInDatabase = async (customer: Omit<ICustomer, 'id'>): Promise<number | undefined> => {

    const [result] = await Knex(ETableNames.customer)
        .insert(customer)
        .returning('id')

    //Ele pode retorna um ou outro dependendo do banco de dados
    if (typeof result === 'object') {
        return result.id
    } else if (typeof result === 'number') {
        return result
    }

    return undefined

}

export const insertTokenInDatabase = async (email: string, verification_token: string, verification_token_expiration: Date): Promise<number> => {

    return await Knex(ETableNames.customer)
        .update({ verification_token, verification_token_expiration })
        .where('email', '=', email)

}

export const updateCustomerInDatabase = async (customer: Omit<ICustomerUpdate, 'id'>, idCustomer: number): Promise<number> => {

    return await Knex(ETableNames.customer)
        .update(customer)
        .where('id', '=', idCustomer)

}

export const inactiveCustomerInTheDatabase = async (id: number): Promise<number> => {

    return await Knex(ETableNames.customer)
        .update({status: 'Inativo'})
        .where('id', '=', id)

}

export const hashAndRedefinePasswordInDatabase = async (email: string, password: string): Promise<number> => {

    const hashedPassword = await PasswordCrypto.hashPassword(password)

    return await Knex(ETableNames.customer)
        .update({ password: hashedPassword, verification_token: null, verification_token_expiration: null })
        .where('email', '=', email)

}

export const insertNewImageInDatabase = async (idCustomer: number, newImageUpdated: string): Promise<number> => {

    const [insertedProductId] = await Knex(ETableNames.customer)
        .update({ image: newImageUpdated })
        .where('id', '=', idCustomer)
        .returning('id')

    return insertedProductId.id

}

export const updateCustomerImageInDatabase = async (idCustomer: number, newImageUpdated: string, trx: knex.Transaction): Promise<number> => {

    if (trx) {
        return await trx(ETableNames.customer).update({ image: newImageUpdated })
            .where('id', '=', idCustomer)
    } else {
        return await Knex(ETableNames.customer).update({ image: newImageUpdated })
            .where('id', '=', idCustomer)
    }

}

export const changingUserImageToNull = async (idCustomer: number, trx: knex.Transaction): Promise<number> => {

    return await trx(ETableNames.customer)
        .update({ image: null })
        .where('id', '=', idCustomer)

}

export const deleteCustomerInDatabase = async (idCustomer: number, trx: knex.Transaction): Promise<number> => {

    return await trx(ETableNames.customer).where('id', '=', idCustomer)
        .del()

}
export const uploadNewImageOnCustomerDirectory = async (newImage: IImageObject): Promise<string> => {

    return await UploadImages.uploadImage(newImage, 'customers')

}

export const deleteCustomerImageFromDirectory = async (imageName: string): Promise<boolean | Error> => {

    try {
        const destinationPath = path.resolve(__dirname, `../../../../images/customers/${imageName}`)
        await UploadImages.removeImage(imageName, destinationPath)

        return true
    } catch (error) {
        return new Error('Houve um erro')
    }

}
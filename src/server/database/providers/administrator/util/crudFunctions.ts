import { ETableNames } from '../../../ETablesNames'
import { IAdministrator, IAdministratorRedefinePassword, IAdministratorUpdate } from '../../../models'
import { Knex } from '../../../knex'
import { Knex as knex } from 'knex'
import { PasswordCrypto } from '../../../../shared/services'

export const getAdministratorById = async (idAdministrator: number): Promise<Omit<IAdministrator, 'password'> | undefined> => {

    return await Knex(ETableNames.administrator).select('id', 'status', 'admin_access_level', 'name', 'email')
        .where('id', '=', idAdministrator)
        .first()

}

export const getAdministratorsWithFilter = async (filter: string, page: number, limit: number, status: string): Promise<Omit<IAdministrator, 'password'>[]> => {

    return Knex(ETableNames.administrator)
        .select('id', 'status', 'admin_access_level', 'name', 'email')
        .where('status', 'like', `${status}%`)
        .andWhere(function () {
            this.andWhere('name', 'like', `%${filter}%`)
                .orWhere('email', 'like', `${filter}%`)
        })
        .andWhere('admin_access_level', '<>', 'Root')
        .offset((page - 1) * limit)
        .limit(limit)

}

export const getAdministratorByEmail = async (email: string): Promise<IAdministrator | undefined> => {

    return await Knex(ETableNames.administrator).select('*')
        .where('email', '=', email)
        .andWhere('status', '<>', 'Inativo')
        .first()

}

export const getTotalOfRegisters = async (filter: string, status: string): Promise<number | undefined> => {

    const [{ count }] = await Knex(ETableNames.administrator)
        .where('status', 'like', `${status}%`)
        .andWhere(function () {
            this.andWhere('name', 'like', `%${filter}%`)
                .orWhere('email', 'like', `${filter}%`)
        })
        .andWhere('admin_access_level', '<>', 'Root')
        .count<[{ count: number }]>('* as count')

    return count

}

export const getAllAdminsitratorsForReport = async (filter: string, status: string): Promise<Omit<IAdministrator, 'admin_access_level' | 'password'>[]> => {

    return Knex(ETableNames.administrator)
        .select('id', 'status', 'name', 'email')
        .where('status', 'like', `${status}%`)
        .andWhere(function () {
            this.andWhere('name', 'like', `%${filter}%`)
                .orWhere('email', 'like', `${filter}%`)
        })
        .andWhere('admin_access_level', '<>', 'Root')

}

export const getTokenAndExpiration = async (email: string): Promise<Omit<IAdministratorRedefinePassword, 'email' | 'password' | 'confirmPassword'>> => {

    const result = await Knex(ETableNames.administrator)
        .select('verification_token', 'verification_token_expiration')
        .where('email', '=', email)
        .first()

    return result as Omit<IAdministratorRedefinePassword, 'email' | 'password' | 'confirmPassword'>
}

export const insertAdministratorInDatabase = async (administrator: Omit<IAdministrator, 'id'>, trx: knex.Transaction): Promise<number> => {

    const [administratorId] = await trx(ETableNames.administrator)
        .insert(administrator)
        .returning('id')
        
    return typeof administratorId === 'number' ? administratorId : administratorId.id

}

export const insertTokenInDatabase = async (email: string, verification_token: string, verification_token_expiration: Date): Promise<number> => {

    return await Knex(ETableNames.administrator)
        .update({ verification_token, verification_token_expiration })
        .where('email', '=', email)

}

export const hashAndRedefinePasswordInDatabase = async (email: string, password: string): Promise<number> => {

    const hashedPassword = await PasswordCrypto.hashPassword(password)

    return await Knex(ETableNames.administrator)
        .update({ password: hashedPassword, verification_token: null, verification_token_expiration: null })
        .where('email', '=', email)

}

export const updateAdministratorInDatabase = async (idAdministrator: number, administratorData: Omit<IAdministratorUpdate, 'id' | 'admin_access_level'>, trx: knex.Transaction): Promise<void> => {

    await trx(ETableNames.administrator).update(administratorData)
        .where('id', '=', idAdministrator)

}

export const deleteAdministratorFromDatabase = async (idAdministrator: number, trx: knex.Transaction): Promise<void> => {

    await trx(ETableNames.administrator)
        .where('id', '=', idAdministrator)
        .andWhere('admin_access_level', '<>', 'Root')
        .del()

}
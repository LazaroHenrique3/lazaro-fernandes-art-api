import { ETableNames } from '../../../ETablesNames'
import { IAdministrator, IAdministratorUpdate } from '../../../models'
import { Knex } from '../../../knex'
import { Knex as knex } from 'knex'

export const getAdministratorById = async (idAdministrator: number): Promise<Omit<IAdministrator, 'password'> | undefined> => {

    return await Knex(ETableNames.administrator).select('id', 'status', 'admin_access_level', 'name', 'email')
        .where('id', '=', idAdministrator)
        .first()

}

export const getAdministratorsWithFilter = async (filter: string, page: number, limit: number): Promise<Omit<IAdministrator, 'password'>[]> => {

    return Knex(ETableNames.administrator)
        .select('id', 'status', 'admin_access_level', 'name', 'email')
        .where('name', 'like', `%${filter}%`)
        .andWhere('admin_access_level', '<>', 'Root')
        .offset((page - 1) * limit)
        .limit(limit)

}

export const getAdministratorByEmail = async (email: string): Promise<IAdministrator | undefined> => {

    return await Knex(ETableNames.administrator).select('*')
        .where('email', '=', email)
        .first()

}

export const getTotalOfRegisters = async (filter: string): Promise<number | undefined> => {

    const [{ count }] = await Knex(ETableNames.administrator)
        .where('name', 'like', `%${filter}%`)
        .andWhere('admin_access_level', '<>', 'Root')
        .count<[{ count: number }]>('* as count')

    return count

}

export const insertAdministratorInDatabase = async (administrator: Omit<IAdministrator, 'id'>, trx: knex.Transaction): Promise<number> => {

    const [administratorId] = await trx(ETableNames.administrator).insert(administrator).returning('id')
    return typeof administratorId === 'number' ? administratorId : administratorId.id

}

export const updateAdministratorInDatabase = async (idAdministrator: number, administratorData: Omit<IAdministratorUpdate, 'id' | 'admin_access_level'>, trx: knex.Transaction): Promise<void> => {

    await trx(ETableNames.administrator).update(administratorData)
        .where('id', '=', idAdministrator)

}

export const deleteAdministratorFromDatabase = async (idAdministrator: number, trx: knex.Transaction): Promise<void> => {

    await trx(ETableNames.administrator).where('id', '=', idAdministrator)
        .del()

}
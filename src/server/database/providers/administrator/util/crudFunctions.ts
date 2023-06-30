import { ETableNames } from '../../../ETablesNames'
import { IAdministrator } from '../../../models'
import { Knex } from '../../../knex'
import { Knex as knex } from 'knex'

export const getAdministratorById = async (idAdministrator: number): Promise<Omit<IAdministrator, 'password' | 'permissions'> | undefined> => {

    return await Knex(ETableNames.administrator).select('id', 'status', 'name', 'email')
        .where('id', '=', idAdministrator)
        .first()

}

export const getAdministratorsWithFilter = async (filter: string, page: number, limit: number): Promise<Omit<IAdministrator, 'password' | 'permissions'>[]> => {

    return Knex(ETableNames.administrator)
        .select('id', 'status', 'name', 'email')
        .where('name', 'like', `%${filter}%`)
        .offset((page - 1) * limit)
        .limit(limit)

}

export const getAdministratorByEmail = async (email: string): Promise<Omit<IAdministrator, 'permissions'> | undefined> => {

    return await Knex(ETableNames.administrator).select('*')
        .where('email', '=', email)
        .first()

}

export const getTotalOfRegisters = async (filter: string): Promise<number | undefined> => {

    const [{ count }] = await Knex(ETableNames.administrator)
        .where('name', 'like', `%${filter}%`)
        .count<[{ count: number }]>('* as count')

    return count

}

export const getAdministratorPermissionsById = async (idAdministrator: number): Promise<number[]> => {

    const permissions = await Knex(ETableNames.administratorRoleAccess).select('role_access_id')
        .where('administrator_id', idAdministrator)

    return permissions.map((permission) => permission.role_access_id)

}

export const insertAdministratorInDatabase = async (administrator: Omit<IAdministrator, 'id' | 'permissions'>, trx: knex.Transaction): Promise<number> => {

    const [administratorId] = await trx(ETableNames.administrator).insert(administrator).returning('id')
    return typeof administratorId === 'number' ? administratorId : administratorId.id

}

export const insertAdministratorPermissionsInDatabase = async (idAdministrator: number, permissions: number[], trx: knex.Transaction): Promise<void> => {

    const permissionsData = permissions.map((permissionId) => ({
        administrator_id: idAdministrator,
        role_access_id: permissionId
    }))

    await trx(ETableNames.administratorRoleAccess).insert(permissionsData)

}

export const updateAdministratorInDatabase = async (idAdministrator: number, administratorData: Omit<IAdministrator, 'id' | 'permissions'>, trx: knex.Transaction): Promise<void> => {

    await trx(ETableNames.administrator).update(administratorData)
        .where('id', '=', idAdministrator)

}

export const deleteRelationOfAdministratorPermissionsInDatabase = async (idAdministrator: number, trx: knex.Transaction): Promise<void> => {

    await trx(ETableNames.administratorRoleAccess).where('administrator_id', '=', idAdministrator)
        .del()

}

export const deleteAdministratorFromDatabase = async (idAdministrator: number, trx: knex.Transaction): Promise<void> => {

    await trx(ETableNames.administrator).where('id', '=', idAdministrator)
        .del()

}
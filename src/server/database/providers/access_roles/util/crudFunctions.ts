import { ETableNames } from '../../../ETablesNames'
import { IRoleAccess } from '../../../models'
import { Knex } from '../../../knex'

export const getAccessRolesById = async (idAccessRole: number): Promise<IRoleAccess | undefined> => {

    return await Knex(ETableNames.accessRoles)
        .select('*')
        .where('id', '*', idAccessRole)
        .first()

}

export const getTotalOfRegisters = async (filter: string): Promise<number | undefined> => {

    const [{ count }] = await Knex(ETableNames.accessRoles)
        .where('name', 'like', `%${filter}%`)
        .count<[{ count: number }]>('* as count')

    return count

}

export const getAccessRolesWithFilter = async (filter: string, page: number, limit: number, id: number): Promise<IRoleAccess[]> => {

    return await Knex(ETableNames.accessRoles)
        .select('*')
        .where('id', Number(id))
        .orWhere('name', 'like', `%${filter}%`)
        .offset((page - 1) * limit)
        .limit(limit)

}
import { ETableNames } from '../../../ETablesNames'
import { Knex } from '../../../knex'

export const checkValidAdministratorId = async (idAdministrator: number): Promise<boolean> => {

    const administratorResult = await Knex(ETableNames.administrator)
        .select('id')
        .where('id', '=', idAdministrator)
        .first()

    return administratorResult !== undefined
}

export const checkValidEmail = async (email: string, type: 'insert' | 'update', idAdministrator?: number): Promise<boolean> => {

    let administratorResult

    if (type === 'insert') {
        administratorResult = await Knex(ETableNames.administrator)
            .where('email', email)
            .first()
    } else if (type === 'update') {
        administratorResult = await Knex(ETableNames.administrator)
            .where('email', email)
            .andWhereNot('id', idAdministrator)
            .first()
    }


    return administratorResult !== undefined
}

export const checkValidPermissions = async (permissions: number[]): Promise<boolean> => {

    const [{ count }] = await Knex(ETableNames.accessRoles)
        .whereIn('id', permissions)
        .count<[{ count: number }]>('* as count')
    return count === permissions.length

}
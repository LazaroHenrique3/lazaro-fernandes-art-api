import { ETableNames } from '../../ETablesNames'
import { IAdministrator } from '../../models'
import { Knex } from '../../knex'

export const getByEmail = async (email: string): Promise<IAdministrator | Error> => {
    try {
        const result = await Knex(ETableNames.administrator).select('*').where('email', '=', email).first()

        if (result) {
            //Buscando as permissões do usuário
            const permissions = await Knex(ETableNames.administratorRoleAccess).select('role_access_id').where('administrator_id', result.id)

            const formattedResult = {
                id: result.id,
                status: result.status,
                name: result.name,
                email: result.email,
                password: result.password,
                permissions: permissions.map((permission) => permission.role_access_id)
            }

            return formattedResult
        }

        return new Error('Registro não encontrado!')
    } catch (error) {
        console.log(error)
        return new Error('Registro não encontrado!')
    }
}
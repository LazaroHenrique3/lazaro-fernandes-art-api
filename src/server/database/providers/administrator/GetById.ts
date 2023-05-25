import { ETableNames } from '../../ETablesNames'
import { IAdministrator } from '../../models'
import { Knex } from '../../knex'

export const getById = async (id: number): Promise<(Omit<IAdministrator, 'password'>) | Error> => {
    try {
        const result = await Knex(ETableNames.administrator).select('id', 'status', 'name', 'email').where('id', '=', id).first()

        if (result) {
            //Buscando as permissões do usuário
            const permissions = await Knex(ETableNames.administratorRoleAccess).select('role_access_id').where('administrator_id', id)

            const formattedResult = {
                id: result.id,
                status: result.status,
                name: result.name,
                email: result.email,
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
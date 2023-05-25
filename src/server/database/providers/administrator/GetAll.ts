import { ETableNames } from '../../ETablesNames'
import { IAdministrator } from '../../models'
import { Knex } from '../../knex'

//Recebe aquele id para caso um item não esteja na primeira pagina, ele possa retornar junto
export const getAll = async (page: number, limit: number, filter: string, id = 0): Promise<(Omit<IAdministrator, 'password'>)[] | Error> => {
    try {
        let result = await Knex(ETableNames.administrator)
            .select('id', 'status', 'name', 'email')
            .where('id', Number(id))
            .orWhere('name', 'like', `%${filter}%`)
            .offset((page - 1) * limit)
            .limit(limit)

        //Caso passe um id, e ele não esteja na pagina em questão, porém eu desejo retornar ele junto
        if (id > 0 && result.every(item => item.id !== id)) {
            const resultById = await Knex(ETableNames.administrator)
                .select('id', 'status', 'name', 'email')
                .where('id', '*', id)
                .first()

            if (resultById) {
                result = [...result, resultById]
            }
        }

        //Formatando a resposta com o id das permissões que cada administrador possui
        if (result) {
            const formattedResult = await Promise.all(
                result.map(async (admin) => {
                    const permissions = await Knex(ETableNames.administratorRoleAccess)
                        .select('role_access_id')
                        .where('administrator_id', admin.id)

                    return {
                        id: admin.id,
                        status: admin.status,
                        name: admin.name,
                        email: admin.email,
                        permissions: permissions.map((permission) => permission.role_access_id)
                    }
                })
            )

            return formattedResult
        }

        return new Error('Erro ao consultar registros!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao consultar registros!')
    }
}
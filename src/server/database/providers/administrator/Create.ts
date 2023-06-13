import { PasswordCrypto } from '../../../shared/services'
import { ETableNames } from '../../ETablesNames'
import { Knex } from '../../knex'
import { IAdministrator } from '../../models'

export const create = async (administrator: Omit<IAdministrator, 'id'>): Promise<number | Error> => {
    try {
        //Verificando se já existe admnistrator com esse email
        const existingAdministrator = await Knex(ETableNames.administrator).where('email', administrator.email).first()

        if (existingAdministrator) {
            return new Error('Este email já esta cadastrado!')
        }

        const hashedPassword = await PasswordCrypto.hashPassword(administrator.password)

        const { permissions, ...insertAdministratorData } = administrator

        //convertendo para um array numérico, e verificando se são válidas
        const permissionsNumberArray = permissions.map(Number)

        //Verificando se as permissões passadas são válidas
        const [{ count }] = await Knex(ETableNames.accessRoles).whereIn('id', permissionsNumberArray).count<[{ count: number }]>('* as count')

        if (count !== permissions.length) {
            return new Error('Permissões inválidas!')
        }

        //Transaction, para garantir que tanto a inserção das permissions, quanto do adm foram bem sucedidas.
        const result = await Knex.transaction(async (trx) => {
            const [administratorId] = await trx(ETableNames.administrator).insert({ ...insertAdministratorData, password: hashedPassword }).returning('id')

            //Preparando o objeto de permissões
            const permissionsData = permissionsNumberArray.map((permissionId) => ({
                administrator_id: administratorId.id,
                role_access_id: permissionId
            }))

            //armazenando a relação de permissões no banco
            await trx(ETableNames.administratorRoleAccess).insert(permissionsData)

            return administratorId
        })

        //Se tudo correu bem ele deve estar com o id do novo usuário
        if (typeof result === 'number') {
            return result
        } else if (typeof result === 'object') {
            return result.id
        }

        return new Error('Erro ao criar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao criar registro!')
    }
}
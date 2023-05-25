import { PasswordCrypto } from '../../../shared/services'
import { ETableNames } from '../../ETablesNames'
import { IAdministrator } from '../../models'
import { Knex } from '../../knex'

export const updateById = async (id: number, administrator: Omit<IAdministrator, 'id'>): Promise<void | Error> => {
    try {
        const { permissions, ...updateAdministratorData } = administrator

        //verificando se foi passado senha 
        if(updateAdministratorData.password){
            updateAdministratorData.password = await PasswordCrypto.hashPassword(updateAdministratorData.password)
        }

        //Verificando se as permissões passadas são válidas
        const [{ count }] = await Knex(ETableNames.accessRoles).whereIn('id', permissions).count<[{ count: number }]>('* as count')

        if (count !== permissions.length) {
            return new Error('Permissões inválidas!')
        }

        //Transaction, para garantir que tanto a inserção das permissions, quanto do adm foram bem sucedidas.
        const result = await Knex.transaction(async (trx) => {
         
            //Atualizando a tabela de administrator
            await trx(ETableNames.administrator).update(updateAdministratorData).where('id', '=', id)

            // Deletando as permissões existentes do administrador
            await trx(ETableNames.administratorRoleAccess)
                .where('administrator_id', id)
                .del()

            //Preparando o objeto de permissões
            const permissionsData = permissions.map((permissionId) => ({
                administrator_id: id,
                role_access_id: permissionId
            }))

            //armazenando a relação de permissões no banco
            await trx(ETableNames.administratorRoleAccess).insert(permissionsData)

            return true
        })

        if (result === true) return

        return new Error('Erro au atualizar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro au atualizar registro!')
    }
}
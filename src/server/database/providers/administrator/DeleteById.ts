import { ETableNames } from '../../ETablesNames'
import { Knex } from '../../knex'

export const deleteById = async (id: number): Promise<void | Error> => {
    try {
        const result = await Knex.transaction(async (trx) => {
            // Excluir as permissões associadas ao usuário na tabela de associação
            await trx(ETableNames.administratorRoleAccess).where('administrator_id', '=', id).del()

            await trx(ETableNames.administrator).where('id', '=', id).del()

            return true
        })
        
        if(result) return
        
        return new Error('Erro ao apagar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao apagar registro!')
    }
}
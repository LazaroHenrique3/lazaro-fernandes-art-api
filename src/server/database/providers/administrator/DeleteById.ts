import { Knex } from '../../knex'

//Funções auxiliares
import { AdministratorUtil } from './util'

export const deleteById = async (idAdministrator: number): Promise<void | Error> => {

    try {
        const existsAdministrator = await AdministratorUtil.checkValidAdministratorId(idAdministrator)
        if (!existsAdministrator) {
            return new Error('Id informado inválido!')
        }

        const result = await Knex.transaction(async (trx) => {            
            await AdministratorUtil.deleteAdministratorFromDatabase(idAdministrator, trx)

            return true
        })
        
        return (result) ? void 0 : new Error('Erro ao apagar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao apagar registro!')
    }

}
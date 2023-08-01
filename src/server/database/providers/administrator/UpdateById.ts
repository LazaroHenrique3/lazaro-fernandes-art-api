import { PasswordCrypto } from '../../../shared/services'
import { IAdministrator } from '../../models'
import { Knex } from '../../knex'

//Funções auxiliares
import { AdministratorUtil } from './util'

export const updateById = async (idAdministrator: number, administrator: Omit<IAdministrator, 'id'>): Promise<void | Error> => {

    try {
        const existsAdministrator = await AdministratorUtil.checkValidAdministratorId(idAdministrator)
        if (!existsAdministrator) {
            return new Error('Id informado inválido!')
        }

        const existsEmail = await AdministratorUtil.checkValidEmail(administrator.email, 'update', idAdministrator)
        if (existsEmail) {
            return new Error('Este email já esta cadastrado!')
        }
        
        //verificando se foi passado senha 
        if (administrator.password) {
            administrator.password = await PasswordCrypto.hashPassword(administrator.password)
        }

        //Fluxo de atualização
        const result = await Knex.transaction(async (trx) => {
            await AdministratorUtil.updateAdministratorInDatabase(idAdministrator, administrator, trx)

            return true
        })

        return (result) ? void 0 : new Error('Erro ao atualizar registro!')

    } catch (error) {
        console.log(error)
        return new Error('Erro ao atualizar registro!')
    }
}
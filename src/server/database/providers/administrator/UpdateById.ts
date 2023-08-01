import { PasswordCrypto } from '../../../shared/services'
import { IAdministratorUpdate } from '../../models'
import { Knex } from '../../knex'

//Funções auxiliares
import { AdministratorUtil } from './util'

export const updateById = async (idAdministrator: number, administrator: Omit<IAdministratorUpdate, 'id' | 'admin_access_level'>): Promise<void | Error> => {

    try {
        const existsAdministrator = await AdministratorUtil.checkValidAdministratorId(idAdministrator)
        if (!existsAdministrator) {
            return new Error('Id informado inválido!')
        }

        const existsEmail = await AdministratorUtil.checkValidEmail(administrator.email, 'update', idAdministrator)
        if (existsEmail) {
            return new Error('Este email já esta cadastrado!')
        }

        //Verificando se foi passado a senha para atualização também
        if (administrator.password && administrator.confirmPassword) {
            //criptografando a senha
            const hashedPassword = await PasswordCrypto.hashPassword(administrator.password)
            administrator.password = hashedPassword
            delete administrator.confirmPassword
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
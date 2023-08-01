import { PasswordCrypto } from '../../../shared/services'
import { Knex } from '../../knex'
import { IAdministrator } from '../../models'

//Funções auxiliares
import { AdministratorUtil } from './util'

export const create = async (administrator: Omit<IAdministrator, 'id'>): Promise<number | Error> => {

    try {

        const existsEmail = await AdministratorUtil.checkValidEmail(administrator.email, 'insert')
        if (existsEmail) {
            return new Error('Este email já esta cadastrado!')
        }

        //Criptografando a senha
        const hashedPassword = await PasswordCrypto.hashPassword(administrator.password)

        //Fluxo de inserção
        const result = await Knex.transaction(async (trx) => {
            const idOfNewAdministrator = await AdministratorUtil.insertAdministratorInDatabase({ ...administrator, password: hashedPassword }, trx)

            return idOfNewAdministrator
        })

        return (result) ? result : new Error('Erro ao criar registro!')

    } catch (error) {
        console.log(error)
        return new Error('Erro ao criar registro!')
    }

}
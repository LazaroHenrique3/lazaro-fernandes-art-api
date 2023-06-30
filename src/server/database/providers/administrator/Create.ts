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

        const validPermissions = await AdministratorUtil.checkValidPermissions(administrator.permissions.map(Number))
        if (!validPermissions) {
            return new Error('Permissões inválidas!')
        }

        //Criptografando a senha
        const hashedPassword = await PasswordCrypto.hashPassword(administrator.password)

        //Fluxo de inserção
        const result = await Knex.transaction(async (trx) => {
            const { permissions, ...insertAdministratorData } = administrator

            const idOfNewAdministrator = await AdministratorUtil.insertAdministratorInDatabase({ ...insertAdministratorData, password: hashedPassword }, trx)
            await AdministratorUtil.insertAdministratorPermissionsInDatabase(idOfNewAdministrator, permissions.map(Number), trx)

            return idOfNewAdministrator
        })

        return (result) ? result : new Error('Erro ao criar registro!')

    } catch (error) {
        console.log(error)
        return new Error('Erro ao criar registro!')
    }

}
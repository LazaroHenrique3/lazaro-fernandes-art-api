import crypto from 'crypto'
import { SendEmail } from '../../../shared/services'

import { PasswordCrypto } from '../../../shared/services'
import { Knex } from '../../knex'
import { IAdministrator } from '../../models'

//Funções auxiliares
import { AdministratorUtil } from './util'

export const create = async (administrator: Omit<IAdministrator, 'id' | 'password'>): Promise<number | Error> => {

    try {
        if (administrator.admin_access_level !== 'Admin') {
            return new Error('Ação não permitida.')
        }

        const existsEmail = await AdministratorUtil.checkValidEmail(administrator.email, 'insert')
        if (existsEmail) {
            return new Error('Este email já esta cadastrado!')
        }

        //Gerando um token numérico para ele
        const token = crypto.randomBytes(6).toString('hex')
        const sixCharacterToken = token.slice(6)
        const tokenHashed = await PasswordCrypto.hashPassword(sixCharacterToken)

        //enviando o email
        try {
            await SendEmail.newAdministradorPasswordEmail(administrator.email, sixCharacterToken)
        } catch (error) {
            return new Error('Erro inesperado, tente novamente!')
        }

        //Fluxo de inserção
        const result = await Knex.transaction(async (trx) => {
            const idOfNewAdministrator = await AdministratorUtil.insertAdministratorInDatabase({ ...administrator, password: tokenHashed }, trx)

            return idOfNewAdministrator
        })

        return (result) ? result : new Error('Erro ao criar registro!')

    } catch (error) {
        console.log(error)
        return new Error('Erro ao criar registro!')
    }

}
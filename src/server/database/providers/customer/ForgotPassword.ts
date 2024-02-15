import crypto from 'crypto'
import { PasswordCrypto, SendEmail } from '../../../shared/services'

//Funções auxiliares
import { CustomerUtil } from './util'

export const forgotPassword = async (email: string): Promise<void | Error> => {
    try {

        const existsEmail = await CustomerUtil.checkValidEmail(email, 'insert')
        if (!existsEmail) {
            return new Error('Usuário não encontrado!')
        }

        //Gerando um token numérico para ele
        const token = crypto.randomBytes(6).toString('hex')
        const sixCharacterToken = token.slice(6)
        const tokenHashed = await PasswordCrypto.hashPassword(sixCharacterToken)

        //Gerando o tempo de expiração do token
        const now = new Date()
        now.setMinutes(now.getMinutes() + 10)

        //enviando o email
        try {
            const result = await SendEmail.forgotPasswordEmail(email, sixCharacterToken)

            if (result instanceof Error) return new Error('Erro inesperado, tente novamente!')

        } catch (error) {
            return new Error('Erro inesperado, tente novamente!')
        }

        //Salvando as informações no banco
        const result = await CustomerUtil.insertTokenInDatabase(email, tokenHashed, now)

        return (result > 0) ? void 0 : new Error('Erro inesperado, tente novamente!')

    } catch (error) {
        console.log(error)
        return new Error('Erro inesperado, tente novamente!')
    }
}



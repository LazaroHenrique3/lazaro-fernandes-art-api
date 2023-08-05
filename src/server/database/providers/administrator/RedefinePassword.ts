import { IAdministratorRedefinePassword } from '../../../database/models'
import { PasswordCrypto } from '../../../shared/services'

//Funções auxiliares
import { AdministratorUtil } from './util'

export const redefinePassword = async (redefinition: IAdministratorRedefinePassword): Promise<void | Error> => {
    try {

        const existsEmail = await AdministratorUtil.checkValidEmail(redefinition.email, 'insert')
        if (!existsEmail) {
            return new Error('Usuário não encontrado!')
        }

        //Verificandose o token ainda é válido, se sim eu busco ele
        const tokenIsValid = await AdministratorUtil.checkValidToken(redefinition.email)
        if(tokenIsValid instanceof Error){
            return tokenIsValid
        }

        //checando se o token de verificação corresponde ao token gerado pelo user
        const tokenMatch = await PasswordCrypto.verifyPassword(redefinition.verification_token, tokenIsValid)
        if (!tokenMatch) {
            return new Error('Token inválido!')
        }

        //Salvando a nova senha no banco de dados, e descartando os tokens do usuario
        const result = await AdministratorUtil.hashAndRedefinePasswordInDatabase(redefinition.email, redefinition.password)

        return (result > 0) ? void 0 : new Error('Erro ao atualizar registro!')

    } catch (error) {
        console.log(error)
        return new Error('Erro inesperado, tente novamente!')
    }
}





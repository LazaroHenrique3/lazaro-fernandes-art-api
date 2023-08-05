import { ETableNames } from '../../../ETablesNames'
import { Knex } from '../../../knex'
import { getTokenAndExpiration } from './crudFunctions'

export const checkValidAdministratorId = async (idAdministrator: number): Promise<boolean> => {

    const administratorResult = await Knex(ETableNames.administrator)
        .select('id')
        .where('id', '=', idAdministrator)
        .first()

    return administratorResult !== undefined
}

export const checkValidEmail = async (email: string, type: 'insert' | 'update', idAdministrator?: number): Promise<boolean> => {

    let administratorResult

    if (type === 'insert') {
        administratorResult = await Knex(ETableNames.administrator)
            .where('email', email)
            .first()
    } else if (type === 'update') {
        administratorResult = await Knex(ETableNames.administrator)
            .where('email', email)
            .andWhereNot('id', idAdministrator)
            .first()
    }


    return administratorResult !== undefined
}

export const checkValidToken = async (email: string): Promise<string | Error> => {

    //Buscando o token e o tempo de expiração
    const token = await getTokenAndExpiration(email)

    if (token.verification_token_expiration !== null && token.verification_token_expiration !== undefined) {
        const now = new Date()

        if (token.verification_token_expiration < now) {
            return new Error('Token de verificação expirado!')
        }

        return token.verification_token

    } else {
        return new Error('Houve um erro inesperado, tente novamente!')
    }

}

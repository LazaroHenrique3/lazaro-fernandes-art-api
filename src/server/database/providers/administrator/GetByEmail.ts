import { IAdministrator } from '../../models'

//Funções auxiliares
import { AdministratorUtil } from './util'

export const getByEmail = async (email: string): Promise<IAdministrator | Error> => {

    try {
        const admnistrator = await AdministratorUtil.getAdministratorByEmail(email)

        if (admnistrator) {
            return admnistrator
        }

        return new Error('Registro não encontrado!')
    } catch (error) {
        console.log(error)
        return new Error('Registro não encontrado!')
    }

}
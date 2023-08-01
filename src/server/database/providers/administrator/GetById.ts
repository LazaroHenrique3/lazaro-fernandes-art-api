import { IAdministrator } from '../../models'

//Funções auxiliares
import { AdministratorUtil } from './util'

export const getById = async (idAdministrator: number): Promise<(Omit<IAdministrator, 'password'>) | Error> => {

    try {

        const existsAdministrator = await AdministratorUtil.checkValidAdministratorId(idAdministrator)
        if (!existsAdministrator) {
            return new Error('Id informado inválido!')
        }

        const administrator = await AdministratorUtil.getAdministratorById(idAdministrator)

        if (administrator) {
            return administrator
        }

        return new Error('Registro não encontrado!')

    } catch (error) {
        console.log(error)
        return new Error('Registro não encontrado!')
    }

}
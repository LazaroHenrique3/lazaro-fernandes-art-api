import { IAdministrator } from '../../../models'

import {
    getAdministratorPermissionsById
} from './crudFunctions'

export const formatResultByIdForResponse = async (administrator: IAdministrator): Promise<IAdministrator> => {

    //Buscando as permissões
    const permissions = await getAdministratorPermissionsById(administrator.id)

    const formattedResult: IAdministrator = {
        ...administrator,
        permissions,
    }

    return formattedResult
}

export const formatAllResultsForResponse = async (administratorList: Omit<IAdministrator, 'password' | 'permissions'>[]): Promise<Omit<IAdministrator, 'password'>[]> => {

    return await Promise.all(
        administratorList.map(async (administrator) => {

            //Buscando as permissões
            const permissions = await getAdministratorPermissionsById(administrator.id)

            return {
                ...administrator,
                permissions: permissions,
            }
        })
    )

}
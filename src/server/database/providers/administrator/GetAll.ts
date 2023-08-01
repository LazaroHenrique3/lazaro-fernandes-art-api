import { IAdministrator } from '../../models'

//Funções auxiliares
import { AdministratorUtil } from './util'

//Recebe aquele id para caso um item não esteja na primeira pagina, ele possa retornar junto
export const getAll = async (page: number, limit: number, filter: string, id = 0): Promise<(Omit<IAdministrator, 'password'>)[] | Error> => {

    try {
        let resultSearchFilter = await AdministratorUtil.getAdministratorsWithFilter(filter, page, limit)

        //Caso passe um id, e ele não esteja na pagina em questão, porém eu desejo retornar ele junto
        if (id > 0 && resultSearchFilter.every(item => item.id !== id)) {
            const resultById = await AdministratorUtil.getAdministratorById(id)

            if (resultById) {
                resultSearchFilter = [...resultSearchFilter, resultById]
            }
        }

        //Formatando a resposta com o id das dimensões e imagens que cada produto possui
        if (resultSearchFilter) {
            return resultSearchFilter
        }

        return []
      
    } catch (error) {
        console.log(error)
        return new Error('Erro ao consultar registros!')
    }

}
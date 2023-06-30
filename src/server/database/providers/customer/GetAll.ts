import { ICustomer } from '../../models'

//Funções auxiliares
import { CustomerUtil } from './util'

//Recebe aquele id para caso um item não esteja na primeira pagina, ele possa retornar junto
export const getAll = async (page: number, limit: number, filter: string, id = 0): Promise<(Omit<ICustomer, 'password'>)[] | Error> => {
  
    try {
        let resultSearchFilter = await CustomerUtil.getCustomersWithFilter(filter, page, limit, id)

        //Caso passe um id, e ele não esteja na pagina em questão, porém eu desejo retornar ele junto
        if (id > 0 && resultSearchFilter.every(item => item.id !== id)) {
            const resultById = await CustomerUtil.getCustomerById(id)

            if (resultById) {
                resultSearchFilter = [...resultSearchFilter, resultById]
            }
        }

        return resultSearchFilter

    } catch (error) {
        console.log(error)
        return new Error('Erro ao consultar registros!')
    }

}


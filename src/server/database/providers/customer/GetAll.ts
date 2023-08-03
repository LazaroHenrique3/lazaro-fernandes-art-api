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

        const result = await Promise.all(resultSearchFilter.map(async (customer) => {

            //Gerando a url da imagem 
            let image = ''
            if (customer?.image !== undefined && customer?.image !== null) {
                image = `${process.env.LOCAL_ADDRESS}/files/customers/${customer?.image}`
            }

            return {
                ...customer,
                image
            }
        }))

        return result 

    } catch (error) {
        console.log(error)
        return new Error('Erro ao consultar registros!')
    }

}


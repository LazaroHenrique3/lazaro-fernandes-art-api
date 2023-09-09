import { ISale } from '../../models'

//Funções auxiliares
import { SaleUtil } from './util'

//Recebe aquele id para caso um item não esteja na primeira pagina, ele possa retornar junto
export const getAll = async (page: number, limit: number, filter: string, idSale: number, idCustomer: number): Promise<ISale[] | Error> => {

    try {
        const result = SaleUtil.getSaleWithFilter(filter, page, limit, idSale, idCustomer)

        return result
    } catch (error) {
        console.log(error)
        return new Error('Erro ao consultar registros!')
    }

}
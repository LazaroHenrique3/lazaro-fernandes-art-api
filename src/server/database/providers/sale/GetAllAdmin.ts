import { ISaleListAll } from '../../models'

//Funções auxiliares
import { SaleUtil } from './util'

//Recebe aquele id para caso um item não esteja na primeira pagina, ele possa retornar junto
export const getAllAdmin = async (page: number, limit: number, filter: string): Promise<ISaleListAll[] | Error> => {

    try {
        const result = SaleUtil.getSaleWithFilterAdmin(filter, page, limit)

        return result
    } catch (error) {
        console.log(error)
        return new Error('Erro ao consultar registros!')
    }

}
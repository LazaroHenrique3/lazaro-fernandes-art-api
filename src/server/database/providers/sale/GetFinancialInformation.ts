//Funções auxiliares
import { SaleUtil } from './util'
import { IFinancialInformations } from './util/crudFunctions'

//Recebe aquele id para caso um item não esteja na primeira pagina, ele possa retornar junto
export const getFinancialInformation = async (): Promise<IFinancialInformations | Error> => {

    try {
        const result = SaleUtil.getFinancialInformation()

        return result
    } catch (error) {
        console.log(error)
        return new Error('Erro ao consultar registros!')
    }

}
import { ISaleList } from '../../models'

//Funções auxiliares
import { SaleUtil } from './util'

export const getById = async (idCustomer: number, idSale: number): Promise<ISaleList | Error> => {

    try {
        //Verificando se o id informado é valido
        const existsSale = await SaleUtil.checkValidSaleId(idSale, idCustomer)
        if (!existsSale) {
            return new Error('Id informado inválido!')
        }

        //Buscando a venda
        const sale = await SaleUtil.getSaleById(idSale, idCustomer)

        //Retornando o objeto de produtos devidamente formatado
        if (sale) {
            return await SaleUtil.formatResultByIdForResponse(sale, sale.id, sale.address_id, sale.customer_id)
        }

        return new Error('Registro não encontrado!')
    } catch (error) {
        console.log(error)
        return new Error('Registro não encontrado!')
    }

}






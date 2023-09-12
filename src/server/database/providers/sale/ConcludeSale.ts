//Funções auxiliares
import { SaleUtil } from './util'

export const concludeSale = async (idCustomer: number, idSale: number): Promise<void | Error> => {

    try {
        const deliveryDate = SaleUtil.formatAndGetCurrentDate()

        //Verificando se o id de cliente informado é valido
        const existsCustomer = await SaleUtil.checkValidCustomerId(idCustomer)
        if (!existsCustomer) {
            return new Error('Usuário inválido!')
        }

        //Verificando se o id de venda informado é valido
        const existsSale = await SaleUtil.checkValidSaleId(idSale, idCustomer, ['Enviado'])
        if (!existsSale) {
            return new Error('Id informado inválido!')
        }

        await SaleUtil.updateSaleToConcluded(idSale, idCustomer, deliveryDate)
        return void 0

    } catch (error) {
        console.log(error)
        return new Error('Erro ao concluir venda!')
    }

}
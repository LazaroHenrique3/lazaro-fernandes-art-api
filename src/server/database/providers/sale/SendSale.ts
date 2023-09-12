//Funções auxiliares
import { SaleUtil } from './util'

export const sendSale = async (idCustomer: number, idSale: number): Promise<void | Error> => {

    try {

        //Verificando se o id de cliente informado é valido
        const existsCustomer = await SaleUtil.checkValidCustomerId(idCustomer)
        if (!existsCustomer) {
            return new Error('Usuário inválido!')
        }

        //Verificando se o id de venda informado é valido
        const existsSale = await SaleUtil.checkValidSaleId(idSale, idCustomer, ['Em preparação'])
        if (!existsSale) {
            return new Error('Id informado inválido!')
        }

        await SaleUtil.updateSaleToSent(idSale, idCustomer)
        return void 0

    } catch (error) {
        console.log(error)
        return new Error('Erro ao realizar pagamento!')
    }

}
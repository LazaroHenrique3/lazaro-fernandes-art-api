//Funções auxiliares
import { SaleUtil } from './util'

export const updateTrackingCodeById = async (idCustomer: number, idSale: number, trackingCode: string): Promise<void | Error> => {

    try {

        //Verificando se o id de cliente informado é valido
        const existsCustomer = await SaleUtil.checkValidCustomerId(idCustomer)
        if (!existsCustomer) {
            return new Error('Usuário inválido!')
        }

        //Verificando se o id de venda informado é valido
        const existsSale = await SaleUtil.checkValidSaleId(idSale, idCustomer, ['Concluída', 'Em preparação', 'Enviado'])
        if (!existsSale) {
            return new Error('Id informado inválido!')
        }

        await SaleUtil.updateTrackingCode(idSale, idCustomer, trackingCode)
        return void 0

    } catch (error) {
        console.log(error)
        return new Error('Erro ao realizar pagamento!')
    }

}
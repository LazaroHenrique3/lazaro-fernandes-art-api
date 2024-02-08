//Funções auxiliares
import { SendEmail } from '../../../shared/services'
import { CustomerUtil } from '../customer/util'
import { SaleUtil } from './util'

export const sendSale = async (idCustomer: number, idSale: number, trackingCode: string): Promise<void | Error> => {

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

        const result = await SaleUtil.updateSaleToSent(idSale, idCustomer, trackingCode)

        if (result === undefined) {
            //enviando o email
            /* try {
                //Buscando o email do cliente através do id 
                const customer = await CustomerUtil.getCustomerById(idCustomer)

                if (customer) {
                    await SendEmail.saleSendNotification(customer.email, trackingCode, idSale)
                }

            } catch (error) {
                console.error(error)
            } */

            return
        }

        return new Error('Erro ao registrar envio!')

    } catch (error) {
        console.log(error)
        return new Error('Erro ao registrar envio!')
    }

}
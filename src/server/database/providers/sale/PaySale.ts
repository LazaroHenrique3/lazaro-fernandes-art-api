//Funções auxiliares
import { SendEmail } from '../../../shared/services'
import { CustomerUtil } from '../customer/util'
import { SaleUtil } from './util'

export const paySale = async (idCustomer: number, idSale: number): Promise<void | Error> => {

    try {
        const paymentDate = SaleUtil.formatAndGetCurrentDate()

        //Verificando se o id de cliente informado é valido
        const existsCustomer = await SaleUtil.checkValidCustomerId(idCustomer)
        if (!existsCustomer) {
            return new Error('Usuário inválido!')
        }

        //Verificando se o id de venda informado é valido
        const existsSale = await SaleUtil.checkValidSaleId(idSale, idCustomer, ['Ag. Pagamento'])
        if (!existsSale) {
            return new Error('Id informado inválido!')
        }

        //Verificando se a data de pagamento já não expirou
        const isPaymentDateValid = await SaleUtil.checkValidDateToPayment(idSale, idCustomer, paymentDate)
        if (!isPaymentDateValid) {
            return new Error('O prazo de pagamento já expirou!')
        }

        const result = await SaleUtil.updateSaleToInPreparation(idSale, idCustomer, paymentDate)
        
        if (result === undefined) {
            //enviando o email
            /* try {
                //Buscando o email do cliente através do id 
                const customer = await CustomerUtil.getCustomerById(idCustomer)

                if (customer) {
                    await SendEmail.saleInPreparationNotification(customer.email, idSale)
                }

            } catch (error) {
                console.error(error)
            } */

            return
        }

        return new Error('Erro ao realizar pagamento!')

    } catch (error) {
        console.log(error)
        return new Error('Erro ao realizar pagamento!')
    }

}
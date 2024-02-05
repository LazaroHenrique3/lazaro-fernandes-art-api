//Funções auxiliares
import { SendEmail } from '../../../shared/services'
import { CustomerUtil } from '../customer/util'
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

        const result = await SaleUtil.updateSaleToConcluded(idSale, idCustomer, deliveryDate)

        if (result === undefined) {
            //enviando o email
            try {
                //Buscando o email do cliente através do id 
                const customer = await CustomerUtil.getCustomerById(idCustomer)

                if (customer) {
                    await SendEmail.saleConcludeNotification(customer.email, idSale)
                }

            } catch (error) {
                console.error(error)
            }

            return
        }

        return new Error('Erro ao concluir venda!')

    } catch (error) {
        console.log(error)
        return new Error('Erro ao concluir venda!')
    }

}
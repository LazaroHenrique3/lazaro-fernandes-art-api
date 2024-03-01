import { SendEmail } from '../../../shared/services'
import { Knex } from '../../knex'
import { CustomerUtil } from '../customer/util'

//Funções auxiliares
import { SaleUtil } from './util'

export const cancelSale = async (idCustomer: number, idSale: number, typeUser: string): Promise<void | Error> => {

    try {
        //Verificando se o id de cliente informado é valido
        const existsCustomer = await SaleUtil.checkValidCustomerId(idCustomer)
        if (!existsCustomer) {
            return new Error('Usuário inválido!')
        }

        //Se o tipo do usuario que solicitar for customer, ele só pode cancelar se estive no status 'Ag. Pagamento'
        if (typeUser === 'customer') {
            //Verificando, ele só vai retornar como true se a venda estiver como 'Ag. Pagamento'
            const existsSale = await SaleUtil.checkValidSaleId(idSale, idCustomer, ['Ag. Pagamento'])
            if (!existsSale) {
                return new Error('Contate o adminsitrador para cancelar essa venda!')
            }
        }

        //Verificando se o id de venda informado é valido
        const existsSale = await SaleUtil.checkValidSaleId(idSale, idCustomer, ['Ag. Pagamento', 'Em preparação', 'Enviado', 'Concluída'])
        if (!existsSale) {
            return new Error('Id informado inválido!')
        }

        //Buscando os produtos da venda
        const salesItems = await SaleUtil.getSaleItemsById(idSale)

        if (!salesItems) return new Error('Erro ao cancelar!')

        //Fluxo de cancelamento
        const result = await Knex.transaction(async (trx) => {
            //Setando o status da tabela de venda para cancelado
            await SaleUtil.updateSaleToCanceled(idSale, idCustomer, trx)

            //Atualizando as informações do produto no banco de dados, devolvendo as quantidades
            return await SaleUtil.updateProductsSaleCanceledInDatabase(salesItems, trx)
        })

        if (result === undefined) {
            //enviando o email
            try {
                //Buscando o email do cliente através do id 
                const customer = await CustomerUtil.getCustomerById(idCustomer)

                if (customer) {
                    await SendEmail.saleCancelNotification(customer.email, idSale)
                }
            } catch (error) {
                console.error(error)
            }

            return
        }

        return new Error('Erro ao cancelar!')

    } catch (error) {
        console.log(error)
        return new Error('Erro ao cancelar!')
    }

}
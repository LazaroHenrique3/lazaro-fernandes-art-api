import { Knex } from '../../knex'

//Funções auxiliares
import { SaleUtil } from './util'

export const cancelSale = async (idCustomer: number, idSale: number): Promise<void | Error> => {

    try {
        //Verificando se o id de cliente informado é valido
        const existsCustomer = await SaleUtil.checkValidCustomerId(idCustomer)
        if (!existsCustomer) {
            return new Error('Usuário inválido!')
        }

        //Verificando se o id de venda informado é valido
        const existsSale = await SaleUtil.checkValidSaleId(idSale, idCustomer, ['Ag. Pagamento', 'Em preparação'])
        if (!existsSale) {
            return new Error('Id informado inválido!')
        }

        //Buscando os produtos da venda
        const salesItems = await SaleUtil.getSaleItemsById(idSale)

        if (!salesItems) return new Error('Erro ao cancelar!')

        //Fluxo de cancelamento
        const result = await Knex.transaction(async (trx) => {
            //Setando o status da tabela de venda para cancelado
            await SaleUtil.updateSaleToCanceled(idSale, trx)

            //Atualizando as informações do produto no banco de dados, devolvendo as quantidades
            return await SaleUtil.updateProductsSaleCanceledInDatabase(salesItems, trx)
        })

        if (result === undefined) {
            return
        }

        return new Error('Erro ao cancelar!')

    } catch (error) {
        console.log(error)
        return new Error('Erro ao cancelar!')
    }

}
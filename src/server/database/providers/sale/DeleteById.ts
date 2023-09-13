import { Knex } from '../../knex'

//Funções auxiliares
import { SaleUtil } from './util'

export const deleteById = async (idCustomer: number, idSale: number): Promise<void | Error> => {

    try {
        //Verificando se o id de cliente informado é valido
        const existsCustomer = await SaleUtil.checkValidCustomerId(idCustomer)
        if (!existsCustomer) {
            return new Error('Usuário inválido!')
        }

        //Verificando se o id de venda informado é valido
        const existsSale = await SaleUtil.checkValidSaleIdAndReturnStatus(idSale, idCustomer)
        if (!existsSale.isValid) {
            return new Error('Id informado inválido!')
        }

        //Buscando os produtos da venda
        const salesItems = await SaleUtil.getSaleItemsById(idSale)

        if (!salesItems) return new Error('Erro ao deletar!')

        //Fluxo de exclusão
        const result = await Knex.transaction(async (trx) => {
            //Caso o status seja como Cancelada significa que essa ação já foi feita anteriormente
            if (existsSale.status !== 'Cancelada') {
                //Atualizando as informações do produto no banco de dados, devolvendo as quantidades
                await SaleUtil.updateProductsSaleCanceledInDatabase(salesItems, trx)
            }

            //Excluindo a relação do produto e da venda no banco de dados
            await SaleUtil.deleteSalesItemsInDatabase(idSale, trx)

            //Excluindo da tabela de venda
            return await SaleUtil.deleteSaleInDatabase(idSale, trx)
        })

        if (result === undefined) {
            return
        }

        return new Error('Erro ao excluir registro!')

    } catch (error) {
        console.log(error)
        return new Error('Erro ao excluir registro!')
    }

}
import { Knex } from '../../knex'
import { ISale } from '../../models'

//Funções auxiliares
import { SaleUtil } from './util'

type SaleStatus = 'Ag. Pagamento' | 'Em preparação' | 'Enviado' | 'Cancelada' | 'Concluída'

type ISaleWithPaymentReceivedDate = Omit<ISale, 'id' | 'sale_items' | 'tracking_code' | 'delivery_date'> & {
    payment_received_date?: string;
}

export const create = async (sale: Omit<ISale, 'id' | 'status' | 'order_date' | 'tracking_code' | 'payment_due_date' | 'payment_received_date' | 'delivery_date'>): Promise<number | Error> => {

    //Se foi pago com Cartões significa que já deve te ro status Em preparação
    const DEFAULT_CREATE_STATUS: SaleStatus = (sale.payment_method === 'C. CREDITO' || sale.payment_method === 'C. DEBITO') ? 'Em preparação' : 'Ag. Pagamento'

    try {
        const { sale_items, ...sales } = sale

        const existsCustomer = await SaleUtil.checkValidCustomerId(sale.customer_id)
        if (!existsCustomer) {
            return new Error('Usuário inválido!')
        }

        const existsAddress = await SaleUtil.checkValidAddressId(sale.address_id, sale.customer_id)
        if (!existsAddress) {
            return new Error('Endereço inválido!')
        }

        //Formatando o objeto de criação da venda  
        const formattedSale: ISaleWithPaymentReceivedDate = {
            ...sales,
            status: DEFAULT_CREATE_STATUS,
            payment_due_date: SaleUtil.formatAndGetPaymentDueDate(),
            order_date: SaleUtil.formatAndGetCurrentDate(),
        }

        // Se foi pago com Cartões significa que já deve ter o status Em preparação, logo já tem data de recebimento
        if (sale.payment_method === 'C. CREDITO' || sale.payment_method === 'C. DEBITO') {
            formattedSale.payment_received_date = SaleUtil.formatAndGetCurrentDate()
        }

        //Fluxo de inserção
        const result = await Knex.transaction(async (trx) => {

            //Armazenando as informações na venda no banco de dados
            const idOfNewSale = await SaleUtil.insertSaleInDatabase(formattedSale, trx)

            //Preparando o objeto com os produtos da venda e já verificando a disponibilidade
            const salesItems = await SaleUtil.checkAndFormatProductsSale(sale_items, idOfNewSale, trx)

            //Atualizando as informações do produto no banco de dados
            await SaleUtil.updateProductsSaleInDatabase(salesItems, trx)

            //Armazenando as informações dos produtos de venda no banco de dados
            await SaleUtil.insertSalesItemsInDatabase(salesItems, trx)

            return idOfNewSale
        })

        return (result) ? result : new Error('Erro ao criar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao criar registro!')
    }

}


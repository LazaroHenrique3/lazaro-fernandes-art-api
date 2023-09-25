import { ETableNames } from '../../../ETablesNames'
import {
    ISale,
    ISaleItemsList,
    ISaleListAll,
    ISaleListById
} from '../../../models'
import { Knex } from '../../../knex'
import { Knex as knex } from 'knex'

interface ISalesItems {
    idProduct: number
    idSale: number
    availableQuantity: number
    quantity: number
    price: number
}


type ProductStatus = 'Ativo' | 'Vendido' | 'Inativo'
type SaleStatus = 'Ag. Pagamento' | 'Em preparação' | 'Enviado' | 'Cancelada' | 'Concluída'

export const getSaleById = async (idSale: number, idCustomer: number): Promise<ISaleListById | undefined> => {

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return await Knex(ETableNames.sale)
        .select(
            'sale.*',
            'customer.name as customer_name',
            Knex.raw('(SELECT SUM(quantity * price) FROM sales_items WHERE sales_items.sale_id = sale.id) as total')
        )
        .leftJoin(ETableNames.customer, 'sale.customer_id', 'customer.id')
        .where('sale.id', '=', idSale)
        .andWhere('customer_id', '=', idCustomer)
        .first()

}

export const getSaleItemsById = async (idSale: number): Promise<ISaleItemsList[] | undefined> => {

    return await Knex(ETableNames.salesItems).select('sales_items.*', 'product.title as product_title')
        .leftJoin(ETableNames.product, 'sales_items.product_id', 'product.id')
        .where('sale_id', '=', idSale)

}

export const getSaleWithFilterAdmin = async (filter: string, page: number, limit: number): Promise<ISaleListAll[]> => {

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return await Knex(ETableNames.sale)
        .select(
            'sale.*',
            'customer.name as customer_name',
            Knex.raw('(SELECT SUM(quantity * price) FROM sales_items WHERE sales_items.sale_id = sale.id) as total')
        )
        .leftJoin(ETableNames.customer, 'sale.customer_id', 'customer.id')
        .whereIn('sale.customer_id', function () {
            this.select('id')
                .from(ETableNames.customer)
                .where('name', 'like', `%${filter}%`)
        })
        .orderByRaw(`
        CASE 
            WHEN sale.status = 'Ag. Pagamento' THEN 1
            WHEN sale.status = 'Em preparação' THEN 2
            WHEN sale.status = 'Enviado' THEN 3
            WHEN sale.status = 'Concluída' THEN 4
            WHEN sale.status = 'Cancelada' THEN 5
            ELSE 6 -- Ordem padrão para outros status
        END
        ASC`
        )
        .offset((page - 1) * limit)
        .limit(limit)

}

export const getSaleWithFilter = async (filter: string, page: number, limit: number, idSale: number, idCustomer: number): Promise<ISaleListAll[]> => {

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return await Knex(ETableNames.sale)
        .select(
            'sale.*',
            'customer.name as customer_name',
            Knex.raw('(SELECT SUM(quantity * price) FROM sales_items WHERE sales_items.sale_id = sale.id) as total')
        )
        .leftJoin(ETableNames.customer, 'sale.customer_id', 'customer.id')
        .where(function () {
            this.where('customer_id', '=', idCustomer)
                .andWhere(function () {
                    this.where('sale.id', '=', idSale)
                        .orWhereIn('customer_id', function () {
                            this.select('id')
                                .from(ETableNames.customer)
                                .where('name', 'like', `%${filter}%`)
                        })
                })
        })
        .orderByRaw(`
            CASE 
                WHEN sale.status = 'Ag. Pagamento' THEN 1
                WHEN sale.status = 'Em preparação' THEN 2
                WHEN sale.status = 'Enviado' THEN 3
                WHEN sale.status = 'Concluída' THEN 4
                WHEN sale.status = 'Cancelada' THEN 5
                ELSE 6 -- Ordem padrão para outros status
            END
            ASC`
        )
        .offset((page - 1) * limit)
        .limit(limit)

}

export const getAllSalesForReport = async (filter: string): Promise<ISaleListAll[]> => {

    return await Knex(ETableNames.sale)
        .select(
            'sale.*',
            'customer.name as customer_name',
            Knex.raw('(SELECT SUM(quantity * price) FROM sales_items WHERE sales_items.sale_id = sale.id) as total')
        )
        .leftJoin(ETableNames.customer, 'sale.customer_id', 'customer.id')
        .whereIn('sale.customer_id', function () {
            this.select('id')
                .from(ETableNames.customer)
                .where('name', 'like', `%${filter}%`)
        })
        .orderByRaw(`
        CASE 
            WHEN sale.status = 'Ag. Pagamento' THEN 1
            WHEN sale.status = 'Em preparação' THEN 2
            WHEN sale.status = 'Enviado' THEN 3
            WHEN sale.status = 'Concluída' THEN 4
            WHEN sale.status = 'Cancelada' THEN 5
            ELSE 6 -- Ordem padrão para outros status
        END
        ASC`
        )

}

export const getTotalOfRegisters = async (filter: string, idSale: number, idCustomer: number): Promise<number | undefined> => {

    const [{ count }] = await Knex(ETableNames.sale)
        .join(ETableNames.customer, `${ETableNames.sale}.customer_id`, '=', `${ETableNames.customer}.id`)
        .where(function () {
            this.where('customer_id', '=', idCustomer)
                .andWhere(function () {
                    this.where(`${ETableNames.sale}.id`, idSale)
                        .orWhere(`${ETableNames.customer}.name`, 'like', `%${filter}%`)
                })
        })
        .count<[{ count: number }]>('* as count')

    return count

}

export const getTotalOfRegistersAdmin = async (filter: string): Promise<number | undefined> => {

    const [{ count }] = await Knex(ETableNames.sale)
        .join(ETableNames.customer, `${ETableNames.sale}.customer_id`, '=', `${ETableNames.customer}.id`)
        .where(`${ETableNames.customer}.name`, 'like', `%${filter}%`)
        .count<[{ count: number }]>('* as count')

    return count

}

export const insertSaleInDatabase = async (sale: Omit<ISale, 'id' | 'payment_received_date' | 'delivery_date' | 'sale_items'>, trx: knex.Transaction): Promise<number> => {

    const [productId] = await trx(ETableNames.sale)
        .insert(sale)
        .returning('id')

    return typeof productId === 'number' ? productId : productId.id

}

export const insertSalesItemsInDatabase = async (salesItems: ISalesItems[], trx: knex.Transaction): Promise<void> => {

    const ProductsData = salesItems.map((item) => ({
        product_id: item.idProduct,
        sale_id: item.idSale,
        quantity: item.quantity,
        price: item.price,
        discount: 0
    }))

    await trx(ETableNames.salesItems).insert(ProductsData)

}

export const updateSaleToCanceled = async (idSale: number, idCustomer: number, trx: knex.Transaction): Promise<void> => {

    const newStatus: SaleStatus = 'Cancelada'

    await trx(ETableNames.sale)
        .update({ status: newStatus })
        .where('id', '=', idSale)
        .andWhere('customer_id', '=', idCustomer)

}

export const updateSaleToInPreparation = async (idSale: number, idCustomer: number, paymentReceivedDate: string): Promise<void> => {

    const newStatus: SaleStatus = 'Em preparação'

    await Knex(ETableNames.sale)
        .update({ status: newStatus, payment_received_date: paymentReceivedDate })
        .where('id', '=', idSale)
        .andWhere('customer_id', '=', idCustomer)

    return

}

export const updateSaleToSent = async (idSale: number, idCustomer: number, trackingCode: string): Promise<void> => {

    const newStatus: SaleStatus = 'Enviado'

    await Knex(ETableNames.sale)
        .update({ status: newStatus, tracking_code: trackingCode })
        .where('id', '=', idSale)
        .andWhere('customer_id', '=', idCustomer)

    return

}

export const updateSaleToConcluded = async (idSale: number, idCustomer: number, deliveryDate: string): Promise<void> => {

    const newStatus: SaleStatus = 'Concluída'

    await Knex(ETableNames.sale)
        .update({ status: newStatus, delivery_date: deliveryDate })
        .where('id', '=', idSale)
        .andWhere('customer_id', '=', idCustomer)

    return

}

export const updateTrackingCode = async (idSale: number, idCustomer: number, trackingCode: string): Promise<void> => {

    await Knex(ETableNames.sale)
        .update({ tracking_code: trackingCode })
        .where('id', '=', idSale)
        .andWhere('customer_id', '=', idCustomer)

    return

}

export const updateProductsSaleInDatabase = async (salesItems: ISalesItems[], trx: knex.Transaction): Promise<void> => {

    //Preparando o Array de promisses
    const productPromises = salesItems.map(async (item) => {
        const { idProduct, availableQuantity } = item

        const status: ProductStatus = (availableQuantity === 0) ? 'Vendido' : 'Ativo'

        const productInformationForUpdate = {
            status: status,
            quantity: availableQuantity
        }

        // Atualizando o status e a quantidade dos produtos
        await trx(ETableNames.product)
            .update(productInformationForUpdate)
            .where('id', '=', idProduct)
    })

    //Executando as promisses
    try {
        await Promise.all(productPromises)
    } catch (error) {
        console.log(error)
        throw error
    }

}

export const updateProductsSaleCanceledInDatabase = async (salesItems: ISaleItemsList[], trx: knex.Transaction): Promise<void> => {

    //Preparando o Array de promisses
    const productPromises = salesItems.map(async (item) => {
        const { product_id, quantity } = item

        // Consulta para buscar o produto pelo ID e trazer seu preço
        const product = await trx(ETableNames.product)
            .select('quantity')
            .where('id', '=', product_id)
            .first()

        if (product) {

            const status: ProductStatus = 'Ativo'

            const productInformationForUpdate = {
                status: status,
                quantity: product.quantity + quantity
            }

            // Atualizando o status e a quantidade dos produtos
            await trx(ETableNames.product)
                .update(productInformationForUpdate)
                .where('id', '=', product_id)

            return
        }

        throw new Error(`Produto com ID ${product_id} não encontrado.`)
    })

    //Executando as promisses
    try {
        await Promise.all(productPromises)
    } catch (error) {
        console.log(error)
        throw error
    }

}

export const deleteSalesItemsInDatabase = async (idSale: number, trx: knex.Transaction): Promise<void> => {

    await trx(ETableNames.salesItems)
        .where('sale_id', '=', idSale)
        .del()

}

export const deleteSaleInDatabase = async (idSale: number, trx: knex.Transaction): Promise<void> => {

    await trx(ETableNames.sale)
        .where('id', '=', idSale)
        .del()

}


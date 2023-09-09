import { ETableNames } from '../../../ETablesNames'
import { ISale } from '../../../models'
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

export const getSaleById = async (idSale: number, idCustomer: number): Promise<ISale | undefined> => {

    return await Knex(ETableNames.sale).select('*')
        .where('id', '=', idSale)
        .andWhere('customer_id', '=', idCustomer)
        .first()

}

export const getSaleWithFilter = async (filter: string, page: number, limit: number, idSale: number, idCustomer: number): Promise<ISale[]> => {

    return await Knex(ETableNames.sale)
        .select('*')
        .where(function () {
            this.where('customer_id', '=', idCustomer)
                .andWhere(function () {
                    this.where('id', '=', idSale)
                        .orWhereIn('customer_id', function () {
                            this.select('id')
                                .from(ETableNames.customer)
                                .where('name', 'like', `%${filter}%`)
                        })
                })
        })
        .offset((page - 1) * limit)
        .limit(limit)

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

export const insertSaleInDatabase = async (sale: Omit<ISale, 'id' | 'payment_received_date' | 'delivery_date' | 'sales_items'>, trx: knex.Transaction): Promise<number> => {

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
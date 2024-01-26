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

type TTopCategories = {
    name: string
    total_sales: number
}

export interface IFinancialInformations {
    topCategories: TTopCategories[]
    totalRevenue: number
    currentMonthBilling: number
    lastMonthBilling: number
    totalSaleAwaitingPayment: number
    totalSaleInPreparation: number
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

export const getSaleWithFilterAdmin = async (filter: string, status: string, orderDate: string, orderByPrice: string, paymentDueDate: string, page: number, limit: number): Promise<ISaleListAll[]> => {

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return await Knex(ETableNames.sale)
        .select(
            'sale.*',
            'customer.name as customer_name',
            Knex.raw('(SELECT SUM(quantity * price) FROM sales_items WHERE sales_items.sale_id = sale.id) as total')
        )
        .leftJoin(ETableNames.customer, 'sale.customer_id', 'customer.id')
        .where('sale.status', 'like', `${status}%`)
        .andWhere('sale.order_date', 'like', `${orderDate}%`)
        .andWhere('sale.payment_due_date', 'like', `${paymentDueDate}%`)
        .andWhere(function () {
            this.whereIn('sale.customer_id', function () {
                this.select('id')
                    .from(ETableNames.customer)
                    .where('name', 'like', `%${filter}%`)
            }).orWhere('sale.id', 'like', `${filter}%`)
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
        .modify((qb) => {
            // Lógica condicional para ordenação por preço, se necessário
            if (orderByPrice && (orderByPrice === 'ASC' || orderByPrice === 'DESC')) {
                qb.orderBy('total', orderByPrice)
            }
        })
        .offset((page - 1) * limit)
        .limit(limit)

}

export const getSaleWithFilter = async (filter: string, status: string, orderDate: string, orderByPrice: string, paymentDueDate: string, page: number, limit: number, idSale: number, idCustomer: number): Promise<ISaleListAll[]> => {

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return await Knex(ETableNames.sale)
        .select(
            'sale.*',
            'customer.name as customer_name',
            Knex.raw('(SELECT SUM(quantity * price) FROM sales_items WHERE sales_items.sale_id = sale.id) as total')
        )
        .leftJoin(ETableNames.customer, 'sale.customer_id', 'customer.id')
        .where('sale.status', 'like', `${status}%`)
        .andWhere('sale.order_date', 'like', `${orderDate}%`)
        .andWhere('sale.payment_due_date', 'like', `${paymentDueDate}%`)
        .andWhere(function () {
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
        .modify((qb) => {
            // Lógica condicional para ordenação por preço, se necessário
            if (orderByPrice && (orderByPrice === 'ASC' || orderByPrice === 'DESC')) {
                qb.orderBy('total', orderByPrice)
            }
        })
        .offset((page - 1) * limit)
        .limit(limit)

}

export const getAllSalesForReport = async (filter: string, status: string, orderDate: string, orderByPrice: string, paymentDueDate: string): Promise<ISaleListAll[]> => {

    return await Knex(ETableNames.sale)
        .select(
            'sale.*',
            'customer.name as customer_name',
            Knex.raw('(SELECT SUM(quantity * price) FROM sales_items WHERE sales_items.sale_id = sale.id) as total')
        )
        .leftJoin(ETableNames.customer, 'sale.customer_id', 'customer.id')
        .where('sale.status', 'like', `${status}%`)
        .andWhere('sale.order_date', 'like', `${orderDate}%`)
        .andWhere('sale.payment_due_date', 'like', `${paymentDueDate}%`)
        .andWhere(function () {
            this.whereIn('sale.customer_id', function () {
                this.select('id')
                    .from(ETableNames.customer)
                    .where('name', 'like', `%${filter}%`)
            }).orWhere('sale.id', 'like', `${filter}%`)
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
        .modify((qb) => {
            // Lógica condicional para ordenação por preço, se necessário
            if (orderByPrice && (orderByPrice === 'ASC' || orderByPrice === 'DESC')) {
                qb.orderBy('total', orderByPrice)
            }
        })

}

export const getTotalOfRegisters = async (filter: string, orderDate: string, status: string, paymentDueDate: string, idSale: number, idCustomer: number): Promise<number | undefined> => {

    const [{ count }] = await Knex(ETableNames.sale)
        .join(ETableNames.customer, `${ETableNames.sale}.customer_id`, '=', `${ETableNames.customer}.id`)
        .where('sale.status', 'like', `${status}%`)
        .andWhere('sale.order_date', 'like', `${orderDate}%`)
        .where(function () {
            this.where('customer_id', '=', idCustomer)
                .andWhere(function () {
                    this.where(`${ETableNames.sale}.id`, idSale)
                        .orWhere(`${ETableNames.customer}.name`, 'like', `%${filter}%`)
                })
        })
        .andWhere('sale.payment_due_date', 'like', `${paymentDueDate}%`)
        .count<[{ count: number }]>('* as count')

    return count

}

export const getTotalOfRegistersAdmin = async (filter: string, orderDate: string, status: string, paymentDueDate: string): Promise<number | undefined> => {

    const [{ count }] = await Knex(ETableNames.sale)
        .join(ETableNames.customer, `${ETableNames.sale}.customer_id`, '=', `${ETableNames.customer}.id`)
        .where('sale.status', 'like', `${status}%`)
        .andWhere('sale.order_date', 'like', `${orderDate}%`)
        .andWhere(function () {
            this.andWhere(`${ETableNames.customer}.name`, 'like', `%${filter}%`)
                .orWhere('sale.id', 'like', `${filter}%`)
        })
        .andWhere('sale.payment_due_date', 'like', `${paymentDueDate}%`)
        .count<[{ count: number }]>('* as count')

    return count

}

export const getFinancialInformation = async (): Promise<IFinancialInformations | Error> => {
    try {
        const today = new Date()
        const currentMonth = String(today.getMonth() + 1).padStart(2, '0')
        const lastMonth = String(today.getMonth()).padStart(2, '0')

        const totalRevenue = await getTotalRevenue()
        const totalCurrentMonth = await getTotalMonth(currentMonth)
        const totalLastMonth = await getTotalMonth(lastMonth)
        const topCategories = await getTopCategories()

        const totalSaleAwaitingPayment = await getTotalSaleAwaitingPayment()
        const totalSaleInPreparation = await getTotalSaleInPreparation()

        const financialInfo: IFinancialInformations = {
            topCategories,
            totalRevenue,
            currentMonthBilling: totalCurrentMonth,
            lastMonthBilling: totalLastMonth,
            totalSaleAwaitingPayment,
            totalSaleInPreparation
        }

        return financialInfo
    } catch (error) {
        return new Error
    }
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

//Funções auxiliares
const getTotalSaleAwaitingPayment = async (): Promise<number> => {
    const [{ count }] = await Knex(ETableNames.sale)
        .where('status', '=', 'Ag. Pagamento')
        .count<[{ count: number }]>('* as count')

    return (count) ? count : 0
}

const getTotalSaleInPreparation = async (): Promise<number> => {
    const [{ count }] = await Knex(ETableNames.sale)
        .where('status', '=', 'Em preparação')
        .count<[{ count: number }]>('* as count')

    return (count) ? count : 0
}

const getTotalRevenue = async () => {
    const [{ total_revenue }] = await Knex.raw(`
      SELECT 
        SUM(sales_total.total_sales + s.shipping_cost) as total_revenue
      FROM sale s
      JOIN (
        SELECT sale_id, SUM(quantity * price) as total_sales
        FROM sales_items
        GROUP BY sale_id
      ) as sales_total ON s.id = sales_total.sale_id
      WHERE s.status NOT IN ('Ag. Pagamento', 'Cancelada')
    `)

    return total_revenue === null ? 0 : total_revenue
}

const getTotalMonth = async (month: string) => {
    const [{ total_month }] = await Knex.raw(`
      SELECT 
        SUM(sales_total.total_sales + s.shipping_cost) as total_month
      FROM sale s
      JOIN (
        SELECT sale_id, SUM(quantity * price) as total_sales
        FROM sales_items
        GROUP BY sale_id
      ) as sales_total ON s.id = sales_total.sale_id
      WHERE strftime("%m", s.order_date) = ?
        AND s.status NOT IN ('Ag. Pagamento', 'Cancelada')
    `, [month])

    return total_month === null ? 0 : total_month
}

const getTopCategories = async () => {
    const topCategories = await Knex.raw(`
      SELECT 
        c.name,
        COUNT(si.sale_id) as total_sales
      FROM sales_items si
      JOIN product p ON si.product_id = p.id
      JOIN category c ON p.category_id = c.id
      JOIN sale s ON si.sale_id = s.id
      WHERE s.status NOT IN ('Ag. Pagamento', 'Cancelada')
      GROUP BY c.name
      ORDER BY total_sales DESC
      LIMIT 3
    `)

    return topCategories
}








import { ETableNames } from '../../../ETablesNames'
import { Knex as knex } from 'knex'

import {
    ISaleItems, 
    ISaleListById
} from '../../../models'

import {
    getSaleItemsById
} from './crudFunctions'

import {
    AddressProvider
} from '../.././address'


interface ISalesItemsDetails {
    idProduct: number
    idSale: number
    availableQuantity: number
    quantity: number
    price: number
}

export const checkAndFormatProductsSale = async (salesItems: ISaleItems[], idSale: number, trx: knex.Transaction): Promise<ISalesItemsDetails[]> => {

    //Preparando o Array de promisses
    const productPromises = salesItems.map(async (item) => {
        const { idProduct, quantity } = item

        // Consulta para buscar o produto pelo ID e trazer seu preço
        const product = await trx(ETableNames.product)
            .select('price', 'quantity')
            .where('id', '=', idProduct)
            .andWhere(function () {
                this.whereNot('status', '=', 'Vendido').andWhereNot('status', '=', 'Inativo')
            })
            .first()

        if (!product) {
            throw new Error(`Produto com ID ${idProduct} não encontrado.`)
        }

        if (product.quantity < quantity) {
            throw new Error(`Quantidade insuficiente do produto com ID ${idProduct}.`)
        }

        return {
            idProduct,
            idSale,
            price: product.price,
            availableQuantity: product.quantity - quantity,
            quantity,
        }
    })

    //Realizando a consulta das promisses
    try {
        const productsDetails = await Promise.all(productPromises)
        return productsDetails
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const formatResultByIdForResponse = async (sale: ISaleListById, idSale: number, idSaleAddress: number, idCustomer: number): Promise<ISaleListById | Error> => {

    //Buscando os produtos da venda
    const salesItems = await getSaleItemsById(idSale)

    //Buscando as informações do endereço cadastrado na venda
    const saleAddress = await AddressProvider.getById(idSaleAddress, idCustomer)

    if (!(saleAddress instanceof Error) && salesItems) {

        const formattedResult: ISaleListById = {
            ...sale,
            sale_items: salesItems,
            sale_address: saleAddress,
        }

        return formattedResult
    }

    return new Error('Erro inesperado ao consultar venda!')

}

export const formatAndGetCurrentDate = (): string => {
    const today = new Date()
    
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

export const formatAndGetPaymentDueDate = (): string => {
    const today = new Date()

    today.setDate(today.getDate() + 1)

    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

export const formatStringDateForDate = (date: string): Date => {
    const formattedDate = new Date(date).toISOString()

    const [year, month, day] = formattedDate.split('-')
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
}
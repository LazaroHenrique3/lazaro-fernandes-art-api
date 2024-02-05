import { ETableNames } from '../../../ETablesNames'
import { Knex as knex } from 'knex'
import { format, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import {
    IProductCart,
    ISaleItems, 
    ISaleListById
} from '../../../models'

import {
    getSaleItemsById
} from './crudFunctions'

import {
    AddressProvider
} from '../.././address'
import { IPriceDeadlineResponse, Shipping } from '../../../../shared/services'


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

export const formattedPrice = (value: number | string) => {

    if (typeof value === 'string') return ''

    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    })
}

export const getLast12Months = (): { formattedDate: string, monthName: string }[]  => {
    const currentDate = new Date()
    const monthsArray: { formattedDate: string; monthName: string }[] = []

    for (let i = 0; i < 12; i++) {
        const date = subMonths(currentDate, i)
        const formattedDate = format(date, 'yyyy-MM')
        const monthName = format(date, 'MMMM yyyy', { locale: ptBR })
        monthsArray.push({ formattedDate, monthName })
    }

    return monthsArray.reverse()
}

export async function calculateNewShippingValue(formattedSaleItemsProductCart: any): Promise<IPriceDeadlineResponse| Error> {
    try {
        const calculateShippingValue = await Shipping.checkPriceAndDeliveryTime(
            formattedSaleItemsProductCart.cep,
            formattedSaleItemsProductCart.weight,
            formattedSaleItemsProductCart.width,
            formattedSaleItemsProductCart.length,
            formattedSaleItemsProductCart.height
        )

        if (calculateShippingValue instanceof Error) {
            throw new Error('Erro ao calcular frete!')
        }

        return calculateShippingValue
    } catch (error) {
        throw new Error('Erro ao calcular frete!')
    }
}

export const getTotalWeightInKilograms = (productsInCart: IProductCart[]): number => {
    const productWeightInGrams = productsInCart.reduce((acc, product) => {
        return acc + (product.weight * product.quantitySelected)
    }, 0)

    // Convertendo de gramas para quilogramas (dividir por 1000)
    return productWeightInGrams / 1000
}

export const getLargestWidth = (productsInCart: IProductCart[]): number => {
    return productsInCart.reduce((acc, product) => {
        const dimensions = product.dimension.split('x').map(Number)
        const width = dimensions[0]

        return Math.max(acc, width)
    }, 0)
}

export const getLargestLength = (productsInCart: IProductCart[]): number => {
    return productsInCart.reduce((acc, product) => {
        const dimensions = product.dimension.split('x').map(Number)
        const length = dimensions[1]

        return Math.max(acc, length)
    }, 0)
}

export const getTotalHeight = (productsInCart: IProductCart[]): number => {
    return productsInCart.reduce((acc, product) => {
        const dimensions = product.dimension.split('x').map(Number)
        const height = dimensions[2]
        return acc + (height * product.quantitySelected)
    }, 0)
}

export const calculateEstimatedDeliveryTime = (estimatedDeadline: string): string => {
    const ExpectedDeliveryTimePac = new Date()
    ExpectedDeliveryTimePac.setDate(ExpectedDeliveryTimePac.getDate() + Number(estimatedDeadline))
    const formattedDeadlinePac = formatDate(ExpectedDeliveryTimePac)

    return formattedDeadlinePac
}

export const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')

    return `${year}-${month}-${day}`
}

export const replaceCommaWithDot = (inputString: string) => {
    // Use a função replace para substituir todas as vírgulas por pontos
    const resultString = inputString.replace(/,/g, '.')
    return resultString
}


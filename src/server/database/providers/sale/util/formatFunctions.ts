import { ETableNames } from '../../../ETablesNames'
import { Knex as knex } from 'knex'

interface ISalesItems {
    idProduct: number
    quantity: number
}

interface ISalesItemsDetails {
    idProduct: number
    idSale: number
    availableQuantity: number
    quantity: number
    price: number
}

export const checkAndFormatProductsSale = async (salesItems: ISalesItems[], idSale: number, trx: knex.Transaction): Promise<ISalesItemsDetails[]> => {

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
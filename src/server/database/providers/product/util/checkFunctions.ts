import { ETableNames } from '../../../ETablesNames'
import { Knex } from '../../../knex'

export const checkValidProductId = async (idProduct: number): Promise<boolean> => {

    const productResult = await Knex(ETableNames.product)
        .select('id')
        .where('id', '=', idProduct)
        .first()

    return productResult !== undefined
}

export const checkValidDimensions = async (dimensions: number[]): Promise<boolean> => {
    const [{ count }] = await Knex(ETableNames.dimension)
        .whereIn('id', dimensions)
        .count<[{ count: number }]>('* as count')
    return count === dimensions.length
}

export const checkValidImageAndProductIds = async (idImage: number, idProduct: number): Promise<boolean> => {

    const productResult = await Knex(ETableNames.product)
        .select('id')
        .where('id', '=', idProduct)
        .first()

    const productImageResult = await Knex(ETableNames.productImages)
        .select('id')
        .where('id', '=', idImage)
        .andWhere('product_id', '=', idProduct)
        .first()

    return productResult !== undefined && productImageResult !== undefined
}

export const checkTheTotalNumberOfProductImages = async (idProduct: number, operation: 'delete' | 'insert' ): Promise<boolean> => {

    const [{ count }] = await Knex(ETableNames.productImages)
        .where('product_id', idProduct)
        .count<[{ count: number }]>('* as count')

    return (operation === 'delete') ? count > 1  : count < 4

}

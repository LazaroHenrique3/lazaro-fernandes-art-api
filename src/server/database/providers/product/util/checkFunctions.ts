import { ETableNames } from '../../../ETablesNames'
import { Knex } from '../../../knex'

export const checkValidProductId = async (idProduct: number): Promise<boolean> => {

    const productResult = await Knex(ETableNames.product)
        .select('id')
        .where('id', '=', idProduct)
        .first()

    return productResult !== undefined
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

export const checkTheTotalNumberOfProductImages = async (idProduct: number, operation: 'delete' | 'insert'): Promise<boolean> => {

    const [{ count }] = await Knex(ETableNames.productImages)
        .where('product_id', idProduct)
        .count<[{ count: number }]>('* as count')

    return (operation === 'delete') ? count > 1 : count < 4

}
export const checkValidCategoryId = async (idCategory: number): Promise<boolean> => {

    const categoryResult = await Knex(ETableNames.category)
        .select('id')
        .where('id', '=', idCategory)
        .andWhereNot('status', '=', 'Inativo')
        .first()

    return categoryResult !== undefined
}

export const checkValidTechniqueId = async (idTechnique: number): Promise<boolean> => {

    const techniqueResult = await Knex(ETableNames.technique)
        .select('id')
        .where('id', '=', idTechnique)
        .andWhereNot('status', '=', 'Inativo')
        .first()

    return techniqueResult !== undefined
}

export const checkValidDimensionId = async (idDimension: number): Promise<boolean> => {

    const dimensionResult = await Knex(ETableNames.dimension)
        .select('id')
        .where('id', '=', idDimension)
        .andWhereNot('status', '=', 'Inativo')
        .first()

    return dimensionResult !== undefined
}

export const checkValidCategoryTechniqueAndDimension = async (idCategory: number, idTechnique: number, idDimension: number): Promise<boolean | Error> => {
    const isValidCategory = await checkValidCategoryId(idCategory)
    if (!isValidCategory) {
        return new Error('Categoria inválida!')
    }

    //Verificando se existe e esta ativa
    const isValidTechnique = await checkValidTechniqueId(idTechnique)
    if (!isValidTechnique) {
        return new Error('Técnica inválida!')
    }

    //Verificando se existe e esta ativa
    const isValidDimension = await checkValidDimensionId(idDimension)
    if (!isValidDimension) {
        return new Error('Dimensão inválida!')
    }

    return true
}

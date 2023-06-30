import { ETableNames } from '../../../ETablesNames'
import { Knex } from '../../../knex'

export const checkValidCategoryId = async (idCategory: number): Promise<boolean> => {

    const categoryResult = await Knex(ETableNames.category)
        .select('id')
        .where('id', '=', idCategory)
        .first()

    return categoryResult !== undefined
}

export const checkValidCategoryName = async (nameCategory: string, idCategory?: number): Promise<boolean> => {

    let categoryResult = null
    if (idCategory) {
        categoryResult = await Knex(ETableNames.category)
            .where('name', nameCategory)
            .andWhereNot('id', idCategory)
            .first()
    } else {
        categoryResult = await Knex(ETableNames.category)
            .where('name', nameCategory)
            .first()
    }

    return categoryResult !== undefined
}

export const checkIfCategoryIsInUse = async (idCategory: number): Promise<boolean> => {

    const categoryResult = await Knex(ETableNames.product)
        .select('id').where('category_id', '=', idCategory)
        .first()

    return categoryResult !== undefined

}
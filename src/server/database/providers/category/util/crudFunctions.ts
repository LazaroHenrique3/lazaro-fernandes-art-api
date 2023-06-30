import { ETableNames } from '../../../ETablesNames'
import { ICategory } from '../../../models'
import { Knex } from '../../../knex'

export const getCategoryById = async (idCategory: number): Promise<ICategory | undefined> => {

    return await Knex(ETableNames.category)
        .select('*').where('id', '=', idCategory)
        .first()

}

export const getCategoriesWithFilter = async (filter: string, page: number, limit: number): Promise<ICategory[]> => {

    return Knex(ETableNames.category)
        .select('*')
        .where('name', 'like', `%${filter}%`)
        .offset((page - 1) * limit)
        .limit(limit)

}

export const getTotalOfRegisters = async (filter: string): Promise<number | undefined> => {
    const [{ count }] = await Knex(ETableNames.category)
        .where('name', 'like', `%${filter}%`)
        .count<[{ count: number }]>('* as count')

    return count
}

export const insertNewCategoryInDatabase = async (category: Omit<ICategory, 'id'>): Promise<number | undefined> => {

    const [result] = await Knex(ETableNames.category)
        .insert(category)
        .returning('id')

    //Ele pode retorna um ou outro dependendo do banco de dados
    if (typeof result === 'object') {
        return result.id
    } else if (typeof result === 'number') {
        return result
    }

    return undefined

}

export const updateCategoryInDatabase = async (idCategory: number, category: Omit<ICategory, 'id'>): Promise<number | undefined> => {

    const result = await Knex(ETableNames.category)
        .update(category)
        .where('id', '=', idCategory)

    return result
}

export const deleteCategoryFromDatabase = async (idCategory: number): Promise<number> => {

    return await Knex(ETableNames.category)
        .where('id', '=', idCategory)
        .del()

}
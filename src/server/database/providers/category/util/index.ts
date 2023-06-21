import { ETableNames } from '../../../ETablesNames'
import { ICategory } from '../../../models'
import { Knex } from '../../../knex'

//FUNÇÕES RELACIONADOS AO |CRUD|
//--Faz a criação da nova categoria no banco de dados
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

//Faz a atualização da categoria no banco de dados
export const updateCategoryInDatabase = async (idCategory: number, category: Omit<ICategory, 'id'>): Promise<number | undefined> => {

    const result = await Knex(ETableNames.category)
        .update(category)
        .where('id', '=', idCategory)

    return result
}

//--Faz a exclusão da categoria do banco de dados
export const deleteCategoryFromDatabase = async (idCategory: number): Promise<number> => {

    return await Knex(ETableNames.category)
        .where('id', '=', idCategory)
        .del()

}

//--Faz a busca pela categoria de acordo com o id
export const getCategoryById = async (idCategory: number): Promise<ICategory | undefined> => {

    return await Knex(ETableNames.category)
        .select('*').where('id', '=', idCategory)
        .first()

}

//--Faz a busca utilizando o filtro de pesquisa
export const getCategoriesWithFilter = async (filter: string, page: number, limit: number): Promise<ICategory[]> => {

    return Knex(ETableNames.category)
        .select('*')
        .where('name', 'like', `%${filter}%`)
        .offset((page - 1) * limit)
        .limit(limit)

}

//--Traz o total de registros correspondentes par aquelas pesquisa
export const getTotalOfRegisters = async (filter: string): Promise<number | undefined> => {
    const [{ count }] = await Knex(ETableNames.category)
        .where('name', 'like', `%${filter}%`)
        .count<[{ count: number }]>('* as count')

    return count
}

//------//------//

//FUNÇÕES DE VALIDAÇÃO
//--Verifica se o id informado é válido
export const checkValidCategoryId = async (idCategory: number): Promise<boolean> => {

    const categoryResult = await Knex(ETableNames.category)
        .select('id')
        .where('id', '=', idCategory)
        .first()

    return categoryResult !== undefined
}

//--Verifica se já existe essa categoria
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

//--Verifica se a categoria está em uso antes da exclusão
export const checkIfCategoryIsInUse = async (idCategory: number): Promise<boolean> => {

    const categoryResult = await Knex(ETableNames.product)
        .select('id').where('category_id', '=', idCategory)
        .first()

    return categoryResult !== undefined

}





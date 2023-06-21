import { ETableNames } from '../../ETablesNames'
import { ICategory } from '../../models'
import { Knex } from '../../knex'

//Funções auxiliares
import { checkValidCategoryId, checkValidCategoryName } from './util'

export const updateById = async (idCategory: number, category: Omit<ICategory, 'id'>): Promise<void | Error> => {
    
    try {
        const existsCategory = await checkValidCategoryId(idCategory)
        if (!existsCategory) {
            return new Error('Id informado inválido!')
        }

        const existsCategoryName = await checkValidCategoryName(category.name, idCategory)
        if (existsCategoryName) {
            return new Error('Já existe uma técnica com esse nome!')
        }

        const result = await Knex(ETableNames.category).update(category).where('id', '=', idCategory)

        if (result > 0) return

        return new Error('Erro ao atualizar registro!')

    } catch (error) {
        console.log(error)
        return new Error('Erro ao atualizar registro!')
    }

}


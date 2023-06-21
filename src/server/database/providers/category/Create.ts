import { ICategory } from '../../models'

//Funções auxiliares
import { checkValidCategoryName, insertNewCategoryInDatabase } from './util'

export const create = async (category: Omit<ICategory, 'id'>): Promise<number | Error> => {

    try {
        const existsCategoryName = await checkValidCategoryName(category.name)
        if (existsCategoryName) {
            return new Error('Já existe uma categoria com esse nome!')
        }

        const result = await insertNewCategoryInDatabase(category)

        return (result) ? result : new Error('Erro ao criar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao criar registro!')
    }
    
}
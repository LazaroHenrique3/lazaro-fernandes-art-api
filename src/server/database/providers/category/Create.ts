import { ICategory } from '../../models'

//Funções auxiliares
import { CategoryUtil } from './util'

export const create = async (category: Omit<ICategory, 'id'>): Promise<number | Error> => {

    try {
        const existsCategoryName = await CategoryUtil.checkValidCategoryName(category.name)
        if (existsCategoryName) {
            return new Error('Já existe uma categoria com esse nome!')
        }

        const result = await CategoryUtil.insertNewCategoryInDatabase(category)

        return (result) ? result : new Error('Erro ao criar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao criar registro!')
    }
    
}
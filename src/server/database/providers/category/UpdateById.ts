import { ICategory } from '../../models'

//Funções auxiliares
import { CategoryUtil } from './util'

export const updateById = async (idCategory: number, category: Omit<ICategory, 'id'>): Promise<void | Error> => {
    
    try {
        const existsCategory = await CategoryUtil.checkValidCategoryId(idCategory)
        if (!existsCategory) {
            return new Error('Id informado inválido!')
        }

        const existsCategoryName = await CategoryUtil.checkValidCategoryName(category.name, idCategory)
        if (existsCategoryName) {
            return new Error('Já existe uma técnica com esse nome!')
        }

        const result = await CategoryUtil.updateCategoryInDatabase(idCategory, category)

        return (result !== undefined && result > 0) ? void 0 : new Error('Erro ao atualizar registro!')

    } catch (error) {
        console.log(error)
        return new Error('Erro ao atualizar registro!')
    }

}


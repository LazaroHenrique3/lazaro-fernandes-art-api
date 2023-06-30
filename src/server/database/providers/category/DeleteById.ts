//Funções auxiliares
import { CategoryUtil } from './util'

export const deleteById = async (idCategory: number): Promise<void | Error> => {

    try {
        const existsCategory = await CategoryUtil.checkValidCategoryId(idCategory)
        if (!existsCategory) {
            return new Error('Id informado inválido!')
        }

        const categoryIsInUse = await CategoryUtil.checkIfCategoryIsInUse(idCategory)
        if (categoryIsInUse) {
            return new Error('Registro associado á produtos!')
        }

        const result = await CategoryUtil.deleteCategoryFromDatabase(idCategory)

        return (result > 0) ? void 0 : new Error('Erro ao apagar registro!')

    } catch (error) {
        console.log(error)
        return new Error('Erro ao apagar registro!')
    }
    
}



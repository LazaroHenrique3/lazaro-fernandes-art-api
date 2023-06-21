//Funções auxiliares
import { checkValidCategoryId, checkIfCategoryIsInUse, deleteCategoryFromDatabase } from './util'

export const deleteById = async (idCategory: number): Promise<void | Error> => {

    try {
        const existsCategory = await checkValidCategoryId(idCategory)
        if (!existsCategory) {
            return new Error('Id informado inválido!')
        }

        const categoryIsInUse = await checkIfCategoryIsInUse(idCategory)
        if (categoryIsInUse) {
            return new Error('Registro associado á produtos!')
        }

        const result = await deleteCategoryFromDatabase(idCategory)

        return (result > 0) ? void 0 : new Error('Erro ao apagar registro!')

    } catch (error) {
        console.log(error)
        return new Error('Erro ao apagar registro!')
    }
    
}



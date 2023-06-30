import { ICategory } from '../../models'

//Funções auxiliares
import { CategoryUtil } from './util'

export const getById = async (idCategory: number): Promise<ICategory | Error> => {

    try {
        const result = await CategoryUtil.getCategoryById(idCategory)
        
        if(result) return result

        return new Error('Registro não encontrado!')
    } catch (error) {
        console.log(error)
        return new Error('Registro não encontrado!')
    }

}



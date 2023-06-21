import { ICategory } from '../../models'

//Funções auxiliares
import { getCategoryById } from './util'

export const getById = async (idCategory: number): Promise<ICategory | Error> => {

    try {
        const result = await getCategoryById(idCategory)
        
        if(result) return result

        return new Error('Registro não encontrado!')
    } catch (error) {
        console.log(error)
        return new Error('Registro não encontrado!')
    }

}



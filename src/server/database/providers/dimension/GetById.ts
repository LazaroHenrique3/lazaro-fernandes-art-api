import { IDimension } from '../../models'

//Funções auxiliares
import { getDimensionById } from './util'

export const getById = async (idDimension: number): Promise<IDimension | Error> => {
    
    try {
        const result = await getDimensionById(idDimension)
        
        if(result) return result

        return new Error('Registro não encontrado!')
    } catch (error) {
        console.log(error)
        return new Error('Registro não encontrado!')
    }

}
import { IDimension } from '../../models'

//Funções auxiliares
import { DimensionUtil } from './util'

export const getById = async (idDimension: number): Promise<IDimension | Error> => {
    
    try {
        const result = await DimensionUtil.getDimensionById(idDimension)
        
        if(result) return result

        return new Error('Registro não encontrado!')
    } catch (error) {
        console.log(error)
        return new Error('Registro não encontrado!')
    }

}
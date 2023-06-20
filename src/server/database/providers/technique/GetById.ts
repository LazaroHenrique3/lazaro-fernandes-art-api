import { ITechnique } from '../../models'

//Funções auxiliares
import { getTechniqueById } from './util'

export const getById = async (idTechnique: number): Promise<ITechnique | Error> => {

    try {
        const result = await getTechniqueById(idTechnique)
        
        if(result) return result

        return new Error('Registro não encontrado!')
    } catch (error) {
        console.log(error)
        return new Error('Registro não encontrado!')
    }

}



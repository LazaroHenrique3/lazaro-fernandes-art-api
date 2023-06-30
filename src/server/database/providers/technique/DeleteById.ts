//Funções auxiliares
import { TechniqueUtil } from './util'

export const deleteById = async (idTechnique: number): Promise<void | Error> => {

    try {
        const existsTechnique = await TechniqueUtil.checkValidTechniqueId(idTechnique)
        if (!existsTechnique) {
            return new Error('Id informado inválido!')
        }

        const techniqueIsInUse = await TechniqueUtil.checkIfTechniqueIsInUse(idTechnique)
        if (techniqueIsInUse) {
            return new Error('Registro associado á produtos!')
        }

        const result = await TechniqueUtil.deleteTechniqueFromDatabase(idTechnique)

        return (result > 0) ? void 0 : new Error('Erro ao apagar registro!')

    } catch (error) {
        console.log(error)
        return new Error('Erro ao apagar registro!')
    }
    
}



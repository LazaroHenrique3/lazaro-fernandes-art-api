import { ITechnique } from '../../models'

//Funções auxiliares
import { TechniqueUtil } from './util'

export const updateById = async (idTechnique: number, technique: Omit<ITechnique, 'id'>): Promise<void | Error> => {
    
    try {
        const existsTechnique = await TechniqueUtil.checkValidTechniqueId(idTechnique)
        if (!existsTechnique) {
            return new Error('Id informado inválido!')
        }

        const existsTechniqueName = await TechniqueUtil.checkValidTechniqueName(technique.name, idTechnique)
        if (existsTechniqueName) {
            return new Error('Já existe uma técnica com esse nome!')
        }

        const result = await  TechniqueUtil.updateTechniqueInDatabase(idTechnique, technique)

        return (result !== undefined && result > 0) ? void 0 : new Error('Erro ao atualizar registro!')
        
    } catch (error) {
        console.log(error)
        return new Error('Erro ao atualizar registro!')
    }

}


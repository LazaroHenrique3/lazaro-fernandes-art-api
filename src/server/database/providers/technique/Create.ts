import { ITechnique } from '../../models'

//Funções auxiliares
import { TechniqueUtil } from './util'

export const create = async (technique: Omit<ITechnique, 'id'>): Promise<number | Error> => {

    try {
        const existsTechniqueName = await TechniqueUtil.checkValidTechniqueName(technique.name)
        if (existsTechniqueName) {
            return new Error('Já existe uma técnica com esse nome!')
        }

        const result = await TechniqueUtil.insertNewTechniqueInDatabase(technique)

        return (result) ? result : new Error('Erro ao criar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao criar registro!')
    }
    
}




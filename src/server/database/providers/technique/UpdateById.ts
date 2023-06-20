import { ETableNames } from '../../ETablesNames'
import { ITechnique } from '../../models'
import { Knex } from '../../knex'

//Funções auxiliares
import { checkValidTechniqueId, checkValidTechniqueName } from './util'

export const updateById = async (idTechnique: number, technique: Omit<ITechnique, 'id'>): Promise<void | Error> => {
    
    try {
        const existsTechnique = await checkValidTechniqueId(idTechnique)
        if (!existsTechnique) {
            return new Error('Id informado inválido!')
        }

        const existsTechniqueName = await checkValidTechniqueName(technique.name, idTechnique)
        if (existsTechniqueName) {
            return new Error('Já existe uma técnica com esse nome!')
        }
        //TODO
        const result = await Knex(ETableNames.technique).update(technique).where('id', '=', idTechnique)

        if (result > 0) return

        return new Error('Erro ao atualizar registro!')

    } catch (error) {
        console.log(error)
        return new Error('Erro ao atualizar registro!')
    }

}


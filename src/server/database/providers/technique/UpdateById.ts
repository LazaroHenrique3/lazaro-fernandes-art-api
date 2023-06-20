import { ETableNames } from '../../ETablesNames'
import { ITechnique } from '../../models'
import { Knex } from '../../knex'

export const updateById = async (idTechnique: number, technique: Omit<ITechnique, 'id'>): Promise<void | Error> => {
    try {

        const existsTechnique = await checkValidTechniqueId(idTechnique)
        if (!existsTechnique) {
            return new Error('Id informado inválido!')
        }

        const existsTechniqueName = await checkValidTechniqueName(idTechnique, technique.name)
        if (existsTechniqueName) {
            return new Error('Já existe uma técnica com esse nome!')
        }

        const result = await Knex(ETableNames.technique).update(technique).where('id', '=', idTechnique)

        if (result > 0) return

        return new Error('Erro ao atualizar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao atualizar registro!')
    }
}

//Funções auxiliares
//--Verifica se o id informado é válido
const checkValidTechniqueId = async (idTechnique: number): Promise<boolean> => {

    const techniqueResult = await Knex(ETableNames.technique)
        .select('id')
        .where('id', '=', idTechnique)
        .first()

    return techniqueResult !== undefined
}

//--Verifica se já existe alguma tecnica com esse nome
const checkValidTechniqueName = async (idTechnique: number, nameTechnique: string): Promise<boolean> => {

    const techniqueResult = await Knex(ETableNames.technique)
        .where('name', nameTechnique)
        .andWhereNot('id', idTechnique).first()


    return techniqueResult !== undefined
}
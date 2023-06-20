import { ETableNames } from '../../ETablesNames'
import { Knex } from '../../knex'
import { ITechnique } from '../../models'

export const create = async (technique: Omit<ITechnique, 'id'>): Promise<number | Error> => {
    try {
        const existsTechniqueName = await checkValidTechniqueName(technique.name)
        console.log(existsTechniqueName)
        if (existsTechniqueName) {
            return new Error('Já existe uma técnica com esse nome!')
        }

        const result = await insertNewTechniqueInDatabase(technique)

        return (result) ? result : new Error('Erro ao criar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao criar registro!')
    }
}

//Funções auxiliares
//--Verifica se já existe alguma tecnica com esse nome
const checkValidTechniqueName = async (nameTechnique: string): Promise<boolean> => {

    const techniqueResult = await Knex(ETableNames.technique)
        .where('name', nameTechnique)
        .first()

    return techniqueResult !== undefined
}

//Faz a criação da nova tecnica
const insertNewTechniqueInDatabase = async (technique: Omit<ITechnique, 'id'>): Promise<number | undefined> => {
    const [result] = await Knex(ETableNames.technique)
        .insert(technique)
        .returning('id')

    //Ele pode retorna um ou outro dependendo do banco de dados
    if (typeof result === 'object') {
        return result.id
    } else if (typeof result === 'number') {
        return result
    }

    return undefined 
}
import { ETableNames } from '../../../ETablesNames'
import { ITechnique } from '../../../models'
import { Knex } from '../../../knex'

export const getTechniqueById = async (idTechnique: number): Promise<ITechnique | undefined> => {

    return await Knex(ETableNames.technique)
        .select('*').where('id', '=', idTechnique)
        .first()

}

export const getTechniquesWithFilter = async (filter: string, page: number, limit: number): Promise<ITechnique[]> => {

    return Knex(ETableNames.technique)
        .select('*')
        .where('name', 'like', `%${filter}%`)
        .offset((page - 1) * limit)
        .limit(limit)

}

export const getAllTechniquesForReport = async (filter: string): Promise<ITechnique[]> => {

    return Knex(ETableNames.technique)
        .select('*')
        .where('name', 'like', `%${filter}%`)

}

export const getTotalOfRegisters = async (filter: string): Promise<number | undefined> => {

    const [{ count }] = await Knex(ETableNames.technique)
        .where('name', 'like', `%${filter}%`)
        .count<[{ count: number }]>('* as count')

    return count

}

export const insertNewTechniqueInDatabase = async (technique: Omit<ITechnique, 'id'>): Promise<number | undefined> => {

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

export const updateTechniqueInDatabase = async (idTechnique: number, technique: Omit<ITechnique, 'id'>): Promise<number | undefined> => {

    const result = await Knex(ETableNames.technique)
        .update(technique)
        .where('id', '=', idTechnique) 

    return result
}

export const deleteTechniqueFromDatabase = async (idTechnique: number): Promise<number> => {

    return await Knex(ETableNames.technique)
        .where('id', '=', idTechnique)
        .del()

}

import { ETableNames } from '../../../ETablesNames'
import { IDimension } from '../../../models'
import { Knex } from '../../../knex'

export const getDimensionById = async (idDimension: number): Promise<IDimension | undefined> => {

    return await Knex(ETableNames.dimension)
        .select('*').where('id', '=', idDimension)
        .first()

}

export const getDimensionsWithFilter = async (filter: string, page: number, limit: number): Promise<IDimension[]> => {

    return Knex(ETableNames.dimension)
        .select('*')
        .where('dimension', 'like', `%${filter}%`)
        .offset((page - 1) * limit)
        .limit(limit)

}

export const getAllDimensionsForReport = async (filter: string): Promise<IDimension[]> => {

    return Knex(ETableNames.dimension)
        .select('*')
        .where('dimension', 'like', `%${filter}%`)

}

export const getTotalOfRegisters = async (filter: string): Promise<number | undefined> => {

    const [{ count }] = await Knex(ETableNames.dimension)
        .where('dimension', 'like', `%${filter}%`)
        .count<[{ count: number }]>('* as count')

    return count

}

export const insertNewDimensionInDatabase = async (dimension: Omit<IDimension, 'id'>): Promise<number | undefined> => {

    const [result] = await Knex(ETableNames.dimension)
        .insert(dimension)
        .returning('id')

    //Ele pode retorna um ou outro dependendo do banco de dados
    if (typeof result === 'object') {
        return result.id
    } else if (typeof result === 'number') {
        return result
    }

    return undefined

}

export const updateDimensionInDatabase = async (idDimension: number, dimension: Omit<IDimension, 'id'>): Promise<number | undefined> => {

    const result = await Knex(ETableNames.dimension)
        .update(dimension)
        .where('id', '=', idDimension)

    return result
    
}

export const deleteDimensionFromDatabase = async (idDimension: number): Promise<number> => {

    return await Knex(ETableNames.dimension)
        .where('id', '=', idDimension)
        .del()

}


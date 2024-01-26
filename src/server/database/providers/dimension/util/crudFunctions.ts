import { ETableNames } from '../../../ETablesNames'
import { IDimension } from '../../../models'
import { Knex } from '../../../knex'

export const getDimensionById = async (idDimension: number): Promise<IDimension | undefined> => {

    return await Knex(ETableNames.dimension)
        .select('*').where('id', '=', idDimension)
        .first()

}

export const getDimensionsWithFilter = async (filter: string, page: number, limit: number, status: string, showInative: boolean): Promise<IDimension[]> => {

    const dimensions = await Knex(ETableNames.dimension)
        .select('dimension.*', Knex.raw('COUNT(product.id) as product_count'))
        .leftJoin(ETableNames.product, 'dimension.id', 'product.dimension_id')
        .where('dimension.dimension', 'like', `%${filter}%`)
        .andWhere('dimension.status', 'like',  `${status}%`)
        .groupBy('dimension.id')
        .andWhereNot('dimension.status', '=', `${(showInative) ? '' : 'Inativo'}`)
        .offset((page - 1) * limit)
        .limit(limit)
        .orderByRaw(`
        CASE 
            WHEN dimension.status = 'Ativo' THEN 1
            WHEN dimension.status = 'Inativo' THEN 2
        END
        ASC
        `)

    return dimensions
}

export const getAllDimensionsForReport = async (filter: string, status: string): Promise<IDimension[]> => {

    return Knex(ETableNames.dimension)
        .select('*')
        .where('dimension', 'like', `%${filter}%`)
        .andWhere('status', 'like',  `${status}%`)

}

export const getTotalOfRegisters = async (filter: string, status: string, showInative: boolean): Promise<number | undefined> => {

    const [{ count }] = await Knex(ETableNames.dimension)
        .where('dimension', 'like', `%${filter}%`)
        .andWhere('status', 'like', `${status}%`)
        .andWhereNot('dimension.status', '=', `${(showInative) ? '' : 'Inativo'}`)
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


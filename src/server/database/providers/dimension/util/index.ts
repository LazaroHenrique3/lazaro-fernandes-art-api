import { ETableNames } from '../../../ETablesNames'
import { IDimension } from '../../../models'
import { Knex } from '../../../knex'

//FUNÇÕES RELACIONADOS AO |CRUD|
//--Faz a criação da nova dimensão no banco de dados
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

//Faz a atualização da dimensão no banco de dados
export const updateDimensionInDatabase = async (idDimension: number, dimension: Omit<IDimension, 'id'>): Promise<number | undefined> => {

    const result = await Knex(ETableNames.dimension)
        .update(dimension)
        .where('id', '=', idDimension)

    return result
}

//--Faz a exclusão de dimensao do banco de dados
export const deleteDimensionFromDatabase = async (idDimension: number): Promise<number> => {

    return await Knex(ETableNames.dimension)
        .where('id', '=', idDimension)
        .del()

}

//--Faz a busca pela dimensao de acordo com o id
export const getDimensionById = async (idDimension: number): Promise<IDimension | undefined> => {

    return await Knex(ETableNames.dimension)
        .select('*').where('id', '=', idDimension)
        .first()

}

//--Faz a busca utilizando o filtro de pesquisa
export const getDimensionsWithFilter = async (filter: string, page: number, limit: number): Promise<IDimension[]> => {

    return Knex(ETableNames.dimension)
        .select('*')
        .where('dimension', 'like', `%${filter}%`)
        .offset((page - 1) * limit)
        .limit(limit)

}

//--Traz o total de registros correspondentes par aquelas pesquisa
export const getTotalOfRegisters = async (filter: string): Promise<number | undefined> => {
    const [{ count }] = await Knex(ETableNames.dimension)
        .where('dimension', 'like', `%${filter}%`)
        .count<[{ count: number }]>('* as count')

    return count
}

//------//------//

//FUNÇÕES DE VALIDAÇÃO
//--Verifica se o id informado é válido
export const checkValidDimensionId = async (idDimension: number): Promise<boolean> => {

    const dimensionResult = await Knex(ETableNames.dimension)
        .select('id')
        .where('id', '=', idDimension)
        .first()

    return dimensionResult !== undefined
}

//--Verifica se já existe essa dimensão
export const checkValidDimensionName = async (nameDimension: string, idDimension?: number): Promise<boolean> => {

    let dimensionResult = null
    if (idDimension) {
        dimensionResult = await Knex(ETableNames.dimension)
            .where('dimension', nameDimension)
            .andWhereNot('id', idDimension)
            .first()
    } else {
        dimensionResult = await Knex(ETableNames.dimension)
            .where('dimension', nameDimension)
            .first()
    }

    return dimensionResult !== undefined
}

//--Verifica se a dimensão está em uso antes da exclusão
export const checkIfDimensionIsInUse = async (idDimension: number): Promise<boolean> => {

    const dimensionResult = await Knex(ETableNames.productDimensions)
        .select('dimension_id').where('dimension_id', '=', idDimension)
        .first()

    return dimensionResult !== undefined

}





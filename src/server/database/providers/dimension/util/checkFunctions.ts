import { ETableNames } from '../../../ETablesNames'
import { Knex } from '../../../knex'

export const checkValidDimensionId = async (idDimension: number): Promise<boolean> => {

    const dimensionResult = await Knex(ETableNames.dimension)
        .select('id')
        .where('id', '=', idDimension)
        .first()

    return dimensionResult !== undefined

}

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

export const checkIfDimensionIsInUse = async (idDimension: number): Promise<boolean> => {

    const dimensionResult = await Knex(ETableNames.product)
        .select('dimension_id').where('dimension_id', '=', idDimension)
        .first()

    return dimensionResult !== undefined

}
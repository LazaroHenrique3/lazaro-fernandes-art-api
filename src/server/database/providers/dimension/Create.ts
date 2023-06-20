import { IDimension } from '../../models'

//Funções auxiliares
import { checkValidDimensionName, insertNewDimensionInDatabase } from './util'

export const create = async (dimension: Omit<IDimension, 'id'>): Promise<number | Error> => {
    try {
        const existsDimensionName = await checkValidDimensionName(dimension.dimension)
        if (existsDimensionName) {
            return new Error('Essa dimensão já existe!')
        }

        const result = await insertNewDimensionInDatabase(dimension)

        return (result) ? result : new Error('Erro ao criar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao criar registro!')
    }
}
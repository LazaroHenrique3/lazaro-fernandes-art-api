import { IDimension } from '../../models'

//Funções auxiliares
import { DimensionUtil } from './util'

export const create = async (dimension: Omit<IDimension, 'id'>): Promise<number | Error> => {
    try {
        const existsDimensionName = await DimensionUtil.checkValidDimensionName(dimension.dimension)
        if (existsDimensionName) {
            return new Error('Essa dimensão já existe!')
        }

        const result = await DimensionUtil.insertNewDimensionInDatabase(dimension)

        return (result) ? result : new Error('Erro ao criar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao criar registro!')
    }
}
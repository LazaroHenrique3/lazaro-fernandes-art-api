import { IDimension } from '../../models'

//Funções auxiliares
import { DimensionUtil } from './util'

export const updateById = async (idDimension: number, dimension: Omit<IDimension, 'id'>): Promise<void | Error> => {
    try {
        const existsDimension = await DimensionUtil.checkValidDimensionId(idDimension)
        if (!existsDimension) {
            return new Error('Id informado inválido!')
        }

        const existsDimensionName = await DimensionUtil.checkValidDimensionName(dimension.dimension, idDimension)
        if (existsDimensionName) {
            return new Error('Já existe uma dimensão com esse nome!')
        }

        const result = await DimensionUtil.updateDimensionInDatabase(idDimension, dimension)

        return (result !== undefined && result > 0) ? void 0 : new Error('Erro ao atualizar registro!')

    } catch (error) {
        console.log(error)
        return new Error('Erro ao atualizar registro!')
    }
}
//Funções auxiliares
import { checkValidDimensionId, checkIfDimensionIsInUse, deleteDimensionFromDatabase } from './util'

export const deleteById = async (idDimension: number): Promise<void | Error> => {
    try {
        const existsDimension = await checkValidDimensionId(idDimension)
        if (!existsDimension) {
            return new Error('Id informado inválido!')
        }

        const dimensionIsInUse = await checkIfDimensionIsInUse(idDimension)
        if (dimensionIsInUse) {
            return new Error('Registro associado á produtos!')
        }

        const result = await deleteDimensionFromDatabase(idDimension)

        return (result > 0) ? void 0 : new Error('Erro ao apagar registro!')

    } catch (error) {
        console.log(error)
        return new Error('Erro ao apagar registro!')
    }
}
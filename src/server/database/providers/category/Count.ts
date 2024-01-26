//Funções auxiliares
import { CategoryUtil } from './util'

export const count = async (filter = '', status = '', showInative = false): Promise<number | Error> => {
    try {
        const count = await CategoryUtil.getTotalOfRegisters(filter, status, showInative)

        if(Number.isInteger(Number(count))) return Number(count)

        return new Error('Erro ao consultar a quantidade total de registros!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao consultar a quantidade total de registros!')
    }
}
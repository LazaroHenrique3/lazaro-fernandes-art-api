//Funções auxiliares
import { AccessRolesUtil } from './util'

export const count = async (filter = ''): Promise<number | Error> => {
    try {
        const count = await AccessRolesUtil.getTotalOfRegisters(filter)

        if(Number.isInteger(Number(count))) return Number(count)

        return new Error('Erro ao consultar a quantidade total de registros!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao consultar a quantidade total de registros!')
    }
}
//Funções auxiliares
import { AdministratorUtil } from './util'

export const count = async (filter = '', status = ''): Promise<number | Error> => {

    try {
        const count = await AdministratorUtil.getTotalOfRegisters(filter, status)

        if(Number.isInteger(Number(count))) return Number(count)

        return new Error('Erro ao consultar a quantidade total de registros!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao consultar a quantidade total de registros!')
    }

}
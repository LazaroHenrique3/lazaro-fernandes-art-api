//Funções auxiliares
import { CustomerUtil } from './util'

export const count = async (filter = '', status = '', genre = '', dateOfBith =  ''): Promise<number | Error> => {
    try {
        const count = await CustomerUtil.getTotalOfRegisters(filter, status, genre, dateOfBith)

        if(Number.isInteger(Number(count))) return Number(count)

        return new Error('Erro ao consultar a quantidade total de registros!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao consultar a quantidade total de registros!')
    }
}
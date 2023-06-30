//Funções auxiliares
import { AddressUtil } from './util'

export const count = async (filter = '', idAdress: number): Promise<number | Error> => {
    try {
        const count = await AddressUtil.getTotalOfRegisters(filter, idAdress)

        if(Number.isInteger(Number(count))) return Number(count)

        return new Error('Erro ao consultar a quantidade total de registros!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao consultar a quantidade total de registros!')
    }
}
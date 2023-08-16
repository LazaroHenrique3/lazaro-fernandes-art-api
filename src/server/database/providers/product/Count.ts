//Funções auxiliares
import { ProductUtil } from './util'

export const count = async (filter = '', category = '', technique = ''): Promise<number | Error> => {
    try {
        const count = await ProductUtil.getTotalOfRegisters(filter, category, technique)

        if(Number.isInteger(Number(count))) return Number(count)

        return new Error('Erro ao consultar a quantidade total de registros!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao consultar a quantidade total de registros!')
    }
}
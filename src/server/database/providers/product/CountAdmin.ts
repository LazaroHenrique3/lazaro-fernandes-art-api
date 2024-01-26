//Funções auxiliares
import { ProductUtil } from './util'

export const countAdmin = async (filter = '',  status = '', type = '', orientation = '', category = '', technique = '', dimension = '', productionDate = ''): Promise<number | Error> => {
    try {
        const count = await ProductUtil.getAdminTotalOfRegisters(filter, status, type, orientation, category, technique, dimension, productionDate)

        if(Number.isInteger(Number(count))) return Number(count)

        return new Error('Erro ao consultar a quantidade total de registros!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao consultar a quantidade total de registros!')
    }
}
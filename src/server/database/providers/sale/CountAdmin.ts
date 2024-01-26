//Funções auxiliares
import { SaleUtil } from './util'

export const countAdmin = async (filter = '', orderDate = '', status = '', paymentDueDate = ''): Promise<number | Error> => {
    try {
        const count = await SaleUtil.getTotalOfRegistersAdmin(filter, orderDate, status, paymentDueDate)

        if(Number.isInteger(Number(count))) return Number(count)

        return new Error('Erro ao consultar a quantidade total de registros!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao consultar a quantidade total de registros!')
    }
}
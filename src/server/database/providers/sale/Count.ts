//Funções auxiliares
import { SaleUtil } from './util'

export const count = async (filter = '', orderDate = '', status = '', paymentDueDate = '', idSale: number, idCustomer: number): Promise<number | Error> => {
    try {
        const count = await SaleUtil.getTotalOfRegisters(filter, orderDate, status, paymentDueDate, idSale, idCustomer)

        if(Number.isInteger(Number(count))) return Number(count)

        return new Error('Erro ao consultar a quantidade total de registros!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao consultar a quantidade total de registros!')
    }
}
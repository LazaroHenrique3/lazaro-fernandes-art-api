import { ETableNames } from '../../../ETablesNames'
import { Knex } from '../../../knex'

import { cancelSale } from '../CancelSale'
import { formatStringDateForDate } from './formatFunctions'

type SaleStatus = 'Ag. Pagamento' | 'Em preparação' | 'Enviado' | 'Cancelada' | 'Concluída'

export const checkValidSaleId = async (idSale: number, idCustomer: number, isStatus?: SaleStatus[]): Promise<boolean> => {

    const saleResult = await Knex(ETableNames.sale)
        .select('id', 'status')
        .where('id', '=', idSale)
        .andWhere('customer_id', '=', idCustomer)
        .first()

    //Verifico se é algum dos status que eu passei por parâmetro, funciona para restringir até que status é permitido cancelar a venda
    if (isStatus && saleResult) {
        return (isStatus.includes(saleResult.status))
    }

    return saleResult !== undefined
}

export const checkValidSaleIdAndReturnStatus = async (idSale: number, idCustomer: number): Promise<{isValid: boolean,  status: SaleStatus}> => {

    const saleResult = await Knex(ETableNames.sale)
        .select('id', 'status')
        .where('id', '=', idSale)
        .andWhere('customer_id', '=', idCustomer)
        .first()

    if(saleResult){
        return {
            isValid: saleResult !== undefined,
            status: saleResult.status
        }
    }

    //Apenas para ter algum retorno caso ele não exista
    return {
        isValid: false,
        status: 'Ag. Pagamento'
    }
}

export const checkValidAddressId = async (idAddress: number, idCustomer: number): Promise<boolean> => {

    const addressResult = await Knex(ETableNames.address)
        .select('id')
        .where('id', '=', idAddress)
        .andWhere('customer_id', '=', idCustomer)
        .andWhereNot('status', '=', 'Inativo')
        .first()

    return addressResult !== undefined
}

export const checkValidCustomerId = async (idCustomer: number): Promise<boolean> => {

    const customerResult = await Knex(ETableNames.customer)
        .select('id')
        .where('id', '=', idCustomer)
        .first()

    return customerResult !== undefined
}

export const checkValidDateToPayment = async (idSale: number, idCustomer: number, paymentReceivedDateString: string) => {

    const saleResult = await Knex(ETableNames.sale)
        .select('payment_due_date')
        .where('id', '=', idSale)
        .andWhere('customer_id', '=', idCustomer)
        .first()

    if (saleResult) {

        const paymentReceivedDate = formatStringDateForDate(paymentReceivedDateString)
        const paymentDueDate = formatStringDateForDate(saleResult.payment_due_date as string)
       
        const isPaymentDateValid = paymentReceivedDate <= paymentDueDate

        if(!isPaymentDateValid){
            //Significa que já venceu a data de pagamento, logo, posso cancelar automaticamente a compra
            try {
                //Passo default admin para não restringir que isso não foi solicitado pelo amdinin, no entando é permitido que nesse caso seja executado
                await cancelSale(idCustomer, idSale, 'admin')
                return false
            } catch (error) {
                console.log(error)
                return false
            }
        }

        return true
    }

    return false
}



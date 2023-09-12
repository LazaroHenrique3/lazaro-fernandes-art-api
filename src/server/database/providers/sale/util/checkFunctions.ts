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

    if (isStatus && saleResult) {
        return (isStatus.includes(saleResult.status))
    }

    return saleResult !== undefined
}

export const checkValidAddressId = async (idAddress: number, idCustomer: number): Promise<boolean> => {

    const addressResult = await Knex(ETableNames.address)
        .select('id')
        .where('id', '=', idAddress)
        .andWhere('customer_id', '=', idCustomer)
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

        const isPaymentDateValid = paymentReceivedDate > paymentDueDate

        if(!isPaymentDateValid){
            //Significa que já venceu a data de pagamento, logo, posso cancelar automaticamente a compra
            try {
                await cancelSale(idCustomer, idSale)
            } catch (error) {
                console.log(error)
                return false
            }
        }

        return true
    }

    return false
}



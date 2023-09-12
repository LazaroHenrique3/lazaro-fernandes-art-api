import { ETableNames } from '../../../ETablesNames'
import { Knex } from '../../../knex'

type SaleStatus = 'Ag. Pagamento' | 'Em preparação' | 'Enviado' | 'Cancelada' | 'Concluída'

export const checkValidSaleId = async (idSale: number, idCustomer: number, isStatus?: SaleStatus[]): Promise<boolean> => {

    const addressResult = await Knex(ETableNames.sale)
        .select('id', 'status')
        .where('id', '=', idSale)
        .andWhere('customer_id', '=', idCustomer)
        .first()

    if (isStatus && addressResult) {
        return (isStatus.includes(addressResult.status))
    }

    return addressResult !== undefined
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



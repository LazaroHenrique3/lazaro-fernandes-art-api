import { ETableNames } from '../../../ETablesNames'
import { Knex } from '../../../knex'

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


